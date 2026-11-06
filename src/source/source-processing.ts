import type { ErrorDiagnostic } from "../diagnostics/diagnostic.js";
import { SourceInput, type ByteRange } from "./source-input.js";

export interface PhysicalPosition {
  readonly line: number;
  readonly column: number;
}

export type SourceUnitOrigin =
  | "source"
  | "escape"
  | "invalid-utf8"
  | "invalid-escape";

export interface SourceUnit {
  readonly character: string;
  readonly codePoint: number;
  readonly byteRange: ByteRange;
  readonly position: PhysicalPosition;
  readonly origin: SourceUnitOrigin;
  readonly isError: boolean;
}

export type SourceProcessingDiagnostic = ErrorDiagnostic<
  "invalid-utf8" | "invalid-unicode-escape"
> & {
  readonly position: PhysicalPosition;
};

export interface SourceProcessingResult {
  readonly text: string;
  readonly units: readonly SourceUnit[];
  readonly diagnostics: readonly SourceProcessingDiagnostic[];
  originalRange(start: number, end: number): ByteRange;
}

interface DecodedScalar {
  readonly codePoint: number;
  readonly character: string;
  readonly byteRange: ByteRange;
  readonly position: PhysicalPosition;
  readonly invalidUtf8: boolean;
}

const replacementCharacter = "\uFFFD";
const utf8Bom = [0xef, 0xbb, 0xbf] as const;

/**
 * Decodes the original bytes, discards one initial BOM, and translates global
 * Java-style universal-character escapes without reprocessing generated text.
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

function decodeOne(
  bytes: Uint8Array,
  start: number,
): { readonly codePoint: number; readonly end: number; readonly invalid: boolean } {
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

function hasInitialBom(bytes: Uint8Array): boolean {
  return (
    bytes.length >= utf8Bom.length &&
    bytes[0] === utf8Bom[0] &&
    bytes[1] === utf8Bom[1] &&
    bytes[2] === utf8Bom[2]
  );
}

function isHardBreak(codePoint: number): boolean {
  return (
    codePoint === 0x000b ||
    codePoint === 0x000c ||
    codePoint === 0x0085 ||
    codePoint === 0x2028 ||
    codePoint === 0x2029
  );
}

function isUnicodeScalar(codePoint: number): boolean {
  return (
    Number.isInteger(codePoint) &&
    codePoint >= 0 &&
    codePoint <= 0x10ffff &&
    (codePoint < 0xd800 || codePoint > 0xdfff)
  );
}

function hexValue(codePoint: number): number {
  if (codePoint >= 0x30 && codePoint <= 0x39) return codePoint - 0x30;
  if (codePoint >= 0x41 && codePoint <= 0x46) return codePoint - 0x41 + 10;
  if (codePoint >= 0x61 && codePoint <= 0x66) return codePoint - 0x61 + 10;
  return -1;
}

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
