/**
 * UTF-8 maximal-subpart recovery and one-pass global Unicode-escape translation,
 * retaining original-byte provenance and physical positions without normalization.
 * @module
 */
import type { ErrorDiagnostic } from "../diagnostics/diagnostic.js";
import { SourceInput, type ByteRange } from "./source-input.js";

/** One-based position in decoded physical input, before escape translation. */
export interface PhysicalPosition {
  /** Physical line; CRLF counts as one break, as do CR, LF, NEL, VT, FF, LS and PS. */
  readonly line: number;
  /** Scalar/replacement column, not bytes or UTF-16 units; tabs count as one. */
  readonly column: number;
}

/**
 * Provenance of a translated unit: ordinary decoded input, a valid escape,
 * a malformed UTF-8 replacement, or a malformed/non-scalar escape replacement.
 */
export type SourceUnitOrigin =
  | "source"
  | "escape"
  | "invalid-utf8"
  | "invalid-escape";

/** One translated scalar (possibly U+FFFD) with its physical source provenance. */
export interface SourceUnit {
  /** Single scalar string; supplementary scalars occupy two UTF-16 code units. */
  readonly character: string;
  /** Numeric Unicode scalar value, including U+FFFD for recovered errors. */
  readonly codePoint: number;
  /** Frozen original-byte range, spanning the entire escape or invalid subpart. */
  readonly byteRange: ByteRange;
  /** Physical location of the first consumed decoded scalar. */
  readonly position: PhysicalPosition;
  /** How this unit was produced, not inferred from its character value. */
  readonly origin: SourceUnitOrigin;
  /** True for malformed-input replacements, not for a literal valid U+FFFD. */
  readonly isError: boolean;
}

/** Recoverable decoding or escape error, located in original physical input. */
export type SourceProcessingDiagnostic = ErrorDiagnostic<
  "invalid-utf8" | "invalid-unicode-escape"
> & {
  /** Physical position of the malformed sequence's first decoded scalar. */
  readonly position: PhysicalPosition;
};

/** Frozen translated result; no whole-source NFC or NFKC normalization is applied. */
export interface SourceProcessingResult {
  /** Joined translated characters, indexed by UTF-16 code units if used as a JS string. */
  readonly text: string;
  /** Frozen scalar-unit sequence; indices differ from bytes and potentially text indices. */
  readonly units: readonly SourceUnit[];
  /** Byte-ordered frozen list of errors; individual diagnostics are also frozen. */
  readonly diagnostics: readonly SourceProcessingDiagnostic[];
  /**
   * Recover original bytes covering a translated-unit interval.
   * @param start - Inclusive scalar-unit index.
   * @param end - Exclusive scalar-unit index.
   * @returns Frozen byte bounds; empty spans use the next unit's start, previous
   * unit's end at EOF, or input byte length when there are no units.
   * @throws {RangeError} If bounds are nonintegral, reversed or outside units.
   */
  originalRange(start: number, end: number): ByteRange;
}

/** Intermediate decoded scalar before global escape translation. */
interface DecodedScalar {
  /** Decoded scalar value, or U+FFFD after malformed UTF-8. */
  readonly codePoint: number;
  /** Scalar string, potentially two UTF-16 code units. */
  readonly character: string;
  /** Original-byte extent of the scalar or recovered maximal subpart. */
  readonly byteRange: ByteRange;
  /** Physical position before escape processing. */
  readonly position: PhysicalPosition;
  /** Whether decoding inserted a replacement for malformed bytes. */
  readonly invalidUtf8: boolean;
}

/** Replacement used for both malformed UTF-8 and invalid Unicode escapes. */
const replacementCharacter = "\uFFFD";
/** One initial UTF-8 BOM is skipped without advancing the physical position. */
const utf8Bom = [0xef, 0xbb, 0xbf] as const;

/**
 * Decodes the original bytes, discards one initial BOM, and translates global
 * Java-style universal-character escapes without reprocessing generated text.
 * Lowercase u consumes four hex digits; uppercase U consumes eight. Eligibility
 * follows backslash parity and preceding escape output. Invalid candidates consume
 * their available fixed-width span and become one replacement unit; UTF-8 errors
 * remain diagnosed even inside such candidates. Physical positions do not follow
 * newlines produced by escapes.
 * @param input - Owned original bytes; processing does not mutate them.
 * @returns Frozen text/provenance containers and byte-ordered recoverable errors.
 */
export function processSource(input: SourceInput): SourceProcessingResult {
  const decoded = decodeUtf8(input);
  const diagnostics: SourceProcessingDiagnostic[] = [];
  const units: SourceUnit[] = [];

  for (const scalar of decoded) {
    if (scalar.invalidUtf8) {
      diagnostics.push(
        makeDiagnostic(
          "invalid-utf8",
          "Malformed UTF-8 byte sequence; replaced with U+FFFD.",
          scalar.byteRange,
          scalar.position,
        ),
      );
    }
  }

  let index = 0;
  let trailingBackslashes = 0;
  let previousOutputWasEscape = false;

  /**
   * Append a frozen translated unit and update escape-eligibility state.
   * @param character - Single scalar string.
   * @param codePoint - Corresponding numeric scalar.
   * @param byteRange - Frozen original-byte coverage.
   * @param position - Frozen physical start position.
   * @param origin - Production/recovery category.
   * @param isError - Whether this output represents malformed input.
   * @returns Nothing; mutates the unit accumulator and trailing-backslash state.
   */
  const append = (
    character: string,
    codePoint: number,
    byteRange: ByteRange,
    position: PhysicalPosition,
    origin: SourceUnitOrigin,
    isError: boolean,
  ): void => {
    units.push(
      Object.freeze({
        character,
        codePoint,
        byteRange,
        position,
        origin,
        isError,
      }),
    );
    trailingBackslashes =
      codePoint === 0x5c ? trailingBackslashes + 1 : 0;
    previousOutputWasEscape = origin === "escape" || origin === "invalid-escape";
  };

  while (index < decoded.length) {
    const scalar = decoded[index]!;
    const eligible =
      previousOutputWasEscape || trailingBackslashes % 2 === 0;
    const introducer = decoded[index + 1]?.codePoint;

    if (
      scalar.codePoint === 0x5c &&
      eligible &&
      (introducer === 0x75 || introducer === 0x55)
    ) {
      const digitCount = introducer === 0x75 ? 4 : 8;
      const endIndex = Math.min(decoded.length, index + digitCount + 2);
      const escapeScalars = decoded.slice(index, endIndex);
      let value = 0;
      let valid = escapeScalars.length === digitCount + 2;

      for (let digitIndex = 0; digitIndex < digitCount; digitIndex += 1) {
        const digitScalar = decoded[index + digitIndex + 2];
        const digit = digitScalar ? hexValue(digitScalar.codePoint) : -1;
        if (digit < 0) {
          valid = false;
        } else {
          value = value * 16 + digit;
        }
      }

      const consumed = Math.max(2, escapeScalars.length);
      const lastConsumed = decoded[index + consumed - 1] ?? scalar;
      const range = input.range(scalar.byteRange.start, lastConsumed.byteRange.end);
      const position = scalar.position;
      if (valid && isUnicodeScalar(value)) {
        append(
          String.fromCodePoint(value),
          value,
          range,
          position,
          "escape",
          false,
        );
      } else {
        append(replacementCharacter, 0xfffd, range, position, "invalid-escape", true);
        diagnostics.push(
          makeDiagnostic(
            "invalid-unicode-escape",
            "Malformed or non-scalar universal-character escape; replaced with U+FFFD.",
            range,
            position,
          ),
        );
      }
      index += consumed;
      continue;
    }

    append(
      scalar.character,
      scalar.codePoint,
      scalar.byteRange,
      scalar.position,
      scalar.invalidUtf8 ? "invalid-utf8" : "source",
      scalar.invalidUtf8,
    );
    index += 1;
  }

  diagnostics.sort((left, right) => left.location.start - right.location.start);
  const frozenUnits = Object.freeze(units);
  const frozenDiagnostics = Object.freeze(diagnostics);

  return Object.freeze({
    text: units.map((unit) => unit.character).join(""),
    units: frozenUnits,
    diagnostics: frozenDiagnostics,
    /**
     * Map translated units back to their covering original-byte interval.
     * @param start - Inclusive scalar-unit index.
     * @param end - Exclusive scalar-unit index.
     * @returns Frozen bounds, with empty intervals anchored at the next unit or EOF.
     * @throws {RangeError} If the translated-unit bounds are invalid.
     */
    originalRange(start: number, end: number): ByteRange {
      if (
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 0 ||
        end < start ||
        end > units.length
      ) {
        throw new RangeError(
          `Invalid translated-unit range [${start}, ${end}) for ${units.length} units`,
        );
      }

      if (start === end) {
        const offset =
          units[start]?.byteRange.start ??
          units[start - 1]?.byteRange.end ??
          input.byteLength;
        return input.range(offset, offset);
      }

      return input.range(
        units[start]!.byteRange.start,
        units[end - 1]!.byteRange.end,
      );
    },
  });
}

/**
 * Decode bytes with maximal-subpart recovery and physical scalar positions.
 * CR's line advance is delayed until the following scalar, allowing CRLF to share
 * one physical break; a following LF retains its position on the preceding line.
 * @param input - Original bytes; one leading BOM is omitted.
 * @returns Mutable array of frozen decoded records, with no escape translation.
 */
function decodeUtf8(input: SourceInput): DecodedScalar[] {
  const bytes = input.bytes;
  let index = hasInitialBom(bytes) ? utf8Bom.length : 0;
  let line = 1;
  let column = 1;
  let previousWasCarriageReturn = false;
  const decoded: DecodedScalar[] = [];

  while (index < bytes.length) {
    const start = index;
    const current = decodeOne(bytes, index);
    index = current.end;

    if (previousWasCarriageReturn && current.codePoint !== 0x0a) {
      line += 1;
      column = 1;
      previousWasCarriageReturn = false;
    }

    const position = Object.freeze({ line, column });
    const byteRange = input.range(start, current.end);
    decoded.push(
      Object.freeze({
        codePoint: current.codePoint,
        character: String.fromCodePoint(current.codePoint),
        byteRange,
        position,
        invalidUtf8: current.invalid,
      }),
    );

    if (current.codePoint === 0x0d) {
      column += 1;
      previousWasCarriageReturn = true;
    } else if (current.codePoint === 0x0a) {
      line += 1;
      column = 1;
      previousWasCarriageReturn = false;
    } else if (isHardBreak(current.codePoint)) {
      line += 1;
      column = 1;
      previousWasCarriageReturn = false;
    } else {
      column += 1;
      previousWasCarriageReturn = false;
    }
  }

  return decoded;
}

/**
 * Decode one scalar or the longest valid prefix of a malformed UTF-8 sequence.
 * @param bytes - Original byte buffer.
 * @param start - In-bounds byte index, assumed valid by the internal caller.
 * @returns Scalar/replacement, exclusive consumed byte end, and recovery flag.
 */
function decodeOne(
  bytes: Uint8Array,
  start: number,
): {
  /** Decoded scalar or U+FFFD for recovery. */
  readonly codePoint: number;
  /** Exclusive consumed byte offset, leaving the offending next byte for recovery. */
  readonly end: number;
  /** True when a malformed maximal subpart was replaced. */
  readonly invalid: boolean
} {
  const first = bytes[start]!;
  if (first <= 0x7f) {
    return { codePoint: first, end: start + 1, invalid: false };
  }

  let length: 2 | 3 | 4;
  let codePoint: number;
  let secondMinimum = 0x80;
  let secondMaximum = 0xbf;

  if (first >= 0xc2 && first <= 0xdf) {
    length = 2;
    codePoint = first & 0x1f;
  } else if (first >= 0xe0 && first <= 0xef) {
    length = 3;
    codePoint = first & 0x0f;
    if (first === 0xe0) secondMinimum = 0xa0;
    if (first === 0xed) secondMaximum = 0x9f;
  } else if (first >= 0xf0 && first <= 0xf4) {
    length = 4;
    codePoint = first & 0x07;
    if (first === 0xf0) secondMinimum = 0x90;
    if (first === 0xf4) secondMaximum = 0x8f;
  } else {
    return { codePoint: 0xfffd, end: start + 1, invalid: true };
  }

  if (
    start + 1 >= bytes.length ||
    bytes[start + 1]! < secondMinimum ||
    bytes[start + 1]! > secondMaximum
  ) {
    return { codePoint: 0xfffd, end: start + 1, invalid: true };
  }
  codePoint = (codePoint << 6) | (bytes[start + 1]! & 0x3f);

  for (let offset = 2; offset < length; offset += 1) {
    const next = bytes[start + offset];
    if (next === undefined || next < 0x80 || next > 0xbf) {
      return {
        codePoint: 0xfffd,
        end: start + offset,
        invalid: true,
      };
    }
    codePoint = (codePoint << 6) | (next & 0x3f);
  }

  return { codePoint, end: start + length, invalid: false };
}

/**
 * Check the exact UTF-8 BOM prefix without decoding.
 * @param bytes - Bytes to inspect without mutation.
 * @returns Whether at least three bytes begin EF BB BF.
 */
function hasInitialBom(bytes: Uint8Array): boolean {
  return (
    bytes.length >= utf8Bom.length &&
    bytes[0] === utf8Bom[0] &&
    bytes[1] === utf8Bom[1] &&
    bytes[2] === utf8Bom[2]
  );
}

/**
 * Identify physical line breaks handled separately from CR and LF.
 * @param codePoint - Decoded scalar value.
 * @returns True for VT, FF, NEL, LS or PS.
 */
function isHardBreak(codePoint: number): boolean {
  return (
    codePoint === 0x000b ||
    codePoint === 0x000c ||
    codePoint === 0x0085 ||
    codePoint === 0x2028 ||
    codePoint === 0x2029
  );
}

/**
 * Validate a prospective Unicode escape value.
 * @param codePoint - Numeric candidate.
 * @returns Whether the integer is in Unicode range and outside the surrogate block.
 */
function isUnicodeScalar(codePoint: number): boolean {
  return (
    Number.isInteger(codePoint) &&
    codePoint >= 0 &&
    codePoint <= 0x10ffff &&
    (codePoint < 0xd800 || codePoint > 0xdfff)
  );
}

/**
 * Decode an ASCII hexadecimal digit without accepting non-ASCII lookalikes.
 * @param codePoint - Decoded scalar value.
 * @returns Value 0–15, or -1 for a non-hexadecimal character.
 */
function hexValue(codePoint: number): number {
  if (codePoint >= 0x30 && codePoint <= 0x39) return codePoint - 0x30;
  if (codePoint >= 0x41 && codePoint <= 0x46) return codePoint - 0x41 + 10;
  if (codePoint >= 0x61 && codePoint <= 0x66) return codePoint - 0x61 + 10;
  return -1;
}

/**
 * Build an immutable source-processing error without copying its frozen locations.
 * @param code - Recovery category.
 * @param message - Human-readable explanation.
 * @param location - Original-byte extent.
 * @param position - Physical location before escape translation.
 * @returns Frozen error diagnostic referencing the supplied location objects.
 */
function makeDiagnostic(
  code: SourceProcessingDiagnostic["code"],
  message: string,
  location: ByteRange,
  position: PhysicalPosition,
): SourceProcessingDiagnostic {
  return Object.freeze({
    code,
    message,
    severity: "error",
    location,
    position,
  });
}
