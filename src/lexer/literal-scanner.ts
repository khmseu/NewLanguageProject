/**
 * Literal candidate recognition and validation after global Unicode translation.
 * Syntax boundaries use unnormalized scalars; values use NFC before ordinary
 * escapes. Internal diagnostic spans are minimal byte hulls of exact normalized
 * scalar contributors (DEC-088), including intervening bytes when reordered.
 * @module
 */
import type { ErrorDiagnostic } from "../diagnostics/diagnostic.js";
import type { ByteRange } from "../source/source-input.js";
import type { SourceProcessingResult } from "../source/source-processing.js";
import {
  normalizeUnicode18WithOrigins,
  type NormalizedScalar,
} from "../source/unicode-normalization.js";
import { findUnicodeCharacter } from "../source/unicode-data.js";
import { hardLineBreakWidth, isHardLineBreak } from "../source/line-endings.js";

/** Literal syntax families; malformed literals retain their original family. */
export type LiteralKind = "character" | "string" | "raw-string";

/** Literal validation errors, independently of source decoding diagnostics. */
export type LiteralDiagnostic = ErrorDiagnostic<
  "unterminated-literal" | "invalid-literal-escape" | "invalid-character-length"
>;

/** Frozen literal metadata, including a best-effort value on lexical errors. */
export interface CoreLiteral {
  /** Syntax family before validation, even on an error operand. */
  readonly kind: LiteralKind;
  /** NFC content with escapes decoded; errors use U+FFFD, with no post-escape NFC. */
  readonly value: string;
  /** Whether the matching closing delimiter was present. */
  readonly terminated: boolean;
  /** Literal validity only; embedded source errors remain diagnostic-only. */
  readonly valid: boolean;
  /** Original-byte diagnostics from literal validation, excluding source errors. */
  readonly diagnostics: readonly LiteralDiagnostic[];
}

/** Recognized candidate with its exclusive translated scalar offset. */
export interface LiteralCandidate {
  /** One past the matching delimiter, or the first hard ending/EOF on recovery. */
  readonly end: number;
  /** Frozen validated literal metadata; source diagnostics remain separate. */
  readonly literal: CoreLiteral;
}

/** Selected ordinary single-character escapes; no numeric/octal shorthand exists. */
const simpleEscapes: Readonly<Record<string, string>> = Object.freeze({
  a: "\x07", b: "\b", e: "\x1b", f: "\f", n: "\n",
  r: "\r", t: "\t", v: "\v", "'": "'", '"': '"', "\\": "\\",
});

/**
 * Recognize a quoted candidate, retaining malformed content through validation.
 * A raw candidate requires a complete ASCII-tag opener; an unmatched backtick is
 * not a raw literal. Uncontinued ordinary hard endings remain for the next scan.
 * @param source - Already globally translated source with original-byte mapping.
 * @param start - In-bounds translated scalar offset supplied by the core scanner.
 * @returns Candidate metadata, or undefined when no selected opener begins here.
 */
export function scanLiteralAt(
  source: SourceProcessingResult,
  start: number,
): LiteralCandidate | undefined {
  const quote = source.units[start]!.character;
  if (quote !== "'" && quote !== '"' && quote !== "`") return undefined;
  const kind: LiteralKind = quote === "'" ? "character" : quote === '"' ? "string" : "raw-string";
  let contentStart = start + 1;
  let tag = "";
  if (kind === "raw-string") {
    while (contentStart < source.units.length &&
      /^[A-Za-z0-9_]$/.test(source.units[contentStart]!.character)) {
      tag += source.units[contentStart]!.character;
      contentStart += 1;
    }
    if (source.units[contentStart]?.character !== '"') return undefined;
    contentStart += 1;
  }

  let end = contentStart;
  let contentEnd = end;
  let terminated = false;
  const closer = [...`"${tag}\``];
  while (end < source.units.length) {
    const current = source.units[end]!;
    if (kind === "raw-string") {
      if (current.character === '"' &&
        closer.every((character, index) => source.units[end + index]?.character === character)) {
        contentEnd = end;
        end += closer.length;
        terminated = true;
        break;
      }
      end += 1;
    } else {
      if (isHardLineBreak(current.codePoint)) break;
      if (current.character === quote) {
        contentEnd = end;
        end += 1;
        terminated = true;
        break;
      }
      if (current.character === "\\") {
        const next = source.units[end + 1];
        const breakWidth = hardLineBreakWidth(next?.codePoint, source.units[end + 2]?.codePoint);
        if (breakWidth > 0) {
          end += 1;
          if (kind === "string") {
            end += breakWidth;
            while (source.units[end]?.character === " " || source.units[end]?.character === "\t") end += 1;
          }
        } else {
          end += next === undefined ? 1 : 2;
          // A control escape can consume a backslash without escaping the closer.
          if (next?.character === "c" && source.units[end] !== undefined &&
            source.units[end]!.character !== quote && !isHardLineBreak(source.units[end]!.codePoint)) {
            end += 1;
          }
        }
      } else {
        end += 1;
      }
    }
    contentEnd = end;
  }

  const diagnostics: LiteralDiagnostic[] = [];
  if (!terminated) {
    diagnostics.push({
      code: "unterminated-literal", severity: "error",
      message: "Literal is not closed before its terminating line ending or end of file.",
      location: source.originalRange(start, end),
    });
  }
  const content = source.units.slice(contentStart, contentEnd).map((unit) => unit.character).join("");
  const normalized = normalizeUnicode18WithOrigins(content, "NFC");
  const value = kind === "raw-string"
    ? rawValue(normalized)
    : ordinaryValue(source, contentStart, normalized, diagnostics);
  if (kind === "character" && [...value].length !== 1) {
    diagnostics.push({
      code: "invalid-character-length", severity: "error",
      message: "A character literal must decode to exactly one Unicode scalar.",
      location: source.originalRange(start, end),
    });
  }
  diagnostics.sort((left, right) => left.location.start - right.location.start);
  return Object.freeze({
    end,
    literal: Object.freeze({
      kind, value, terminated, valid: diagnostics.length === 0,
      diagnostics: Object.freeze(diagnostics),
    }),
  });
}

/**
 * Normalize raw hard endings to LF without interpreting any ordinary escapes.
 * @param units - NFC scalars; their origin mappings are not changed or consumed.
 * @returns Raw value with adjacent CR/LF grouped as one ending.
 */
function rawValue(units: readonly NormalizedScalar[]): string {
  let value = "";
  for (let index = 0; index < units.length;) {
    const width = hardLineBreakWidth(
      units[index]!.character.codePointAt(0), units[index + 1]?.character.codePointAt(0),
    );
    value += width > 0 ? "\n" : units[index]!.character;
    index += width > 0 ? width : 1;
  }
  return value;
}

/**
 * Decode ordinary escapes on NFC content with contributor-based error locations.
 * Invalid escapes contribute U+FFFD to a best-effort value and remain errors;
 * source-error contributors consumed by a candidate add their own replacements.
 * @param source - Source supplying the original bytes for normalized contributors.
 * @param contentStart - Translated scalar index corresponding to input offset zero.
 * @param units - NFC scalars, with exact pre-normalization contributors.
 * @param diagnostics - Mutable literal-only diagnostic accumulator.
 * @returns Decoded value without post-escape normalization or lost source errors.
 */
function ordinaryValue(
  source: SourceProcessingResult,
  contentStart: number,
  units: readonly NormalizedScalar[],
  diagnostics: LiteralDiagnostic[],
): string {
  let value = "";
  let index = 0;
  while (index < units.length) {
    if (units[index]!.character !== "\\") {
      value += units[index]!.character;
      index += 1;
      continue;
    }
    const escapeStart = index;
    const escape = units[index + 1]?.character;
    index += escape === undefined ? 1 : 2;
    let decoded: string | undefined;
    const width = hardLineBreakWidth(escape?.codePointAt(0), units[index]?.character.codePointAt(0));
    if (width > 0) {
      index += width - 1;
      while (units[index]?.character === " " || units[index]?.character === "\t") index += 1;
      continue;
    }
    if (escape !== undefined && simpleEscapes[escape] !== undefined) {
      decoded = simpleEscapes[escape];
    } else if (escape === "c") {
      const control = units[index]?.character.codePointAt(0);
      if (control !== undefined) {
        index += 1;
        if (control >= 0x3f && control <= 0x7e) {
          decoded = String.fromCodePoint(control === 0x3f ? 0x7f : control & 0x1f);
        }
      }
    } else if ((escape === "x" || escape === "N") && units[index]?.character === "{") {
      index += 1;
      const bodyStart = index;
      while (index < units.length && units[index]!.character !== "}") index += 1;
      const body = units.slice(bodyStart, index).map((unit) => unit.character).join("");
      if (index < units.length) {
        index += 1;
        const codePoint = escape === "N" ? findUnicodeCharacter(body)
          : /^[0-9A-Fa-f]+$/.test(body) ? Number.parseInt(body, 16) : undefined;
        if (codePoint !== undefined && codePoint <= 0x10ffff &&
          !(codePoint >= 0xd800 && codePoint <= 0xdfff)) {
          decoded = String.fromCodePoint(codePoint);
        }
      }
    }
    const sourceErrors = sourceErrorContributors(
      source, contentStart, units.slice(escapeStart, index),
    );
    if (decoded === undefined) {
      diagnostics.push({
        code: "invalid-literal-escape", severity: "error",
        message: "Unrecognized or malformed ordinary literal escape.",
        location: contributorRange(source, contentStart, units.slice(escapeStart, index)),
      });
      value += "\ufffd";
    } else {
      value += decoded;
    }
    value += "\ufffd".repeat(sourceErrors.length);
  }
  return value;
}

/**
 * Collect source-error contributors consumed by one ordinary escape candidate.
 * A candidate may be malformed because its contents contain U+FFFD, but each
 * diagnostic-only source error still contributes its own replacement to value.
 * @param source - Original translated units, including source-error metadata.
 * @param contentStart - Offset of the unnormalized content's first scalar.
 * @param units - Normalized candidate scalars and their exact input contributors.
 * @returns Unique translated input offsets marked as source errors.
 */
function sourceErrorContributors(
  source: SourceProcessingResult,
  contentStart: number,
  units: readonly NormalizedScalar[],
): number[] {
  const offsets = new Set<number>();
  for (const unit of units) {
    for (const offset of unit.inputOffsets) {
      if (source.units[contentStart + offset]?.isError) offsets.add(offset);
    }
  }
  return [...offsets];
}

/**
 * Cover exact contributors with the smallest representable contiguous byte span.
 * Decomposition shares contributors; composition unions them; canonical reorder
 * may include intervening bytes in the hull, but never unrelated prefix/suffix.
 * @param source - Original-byte mappings for translated scalars.
 * @param contentStart - Offset of the unnormalized content's first scalar.
 * @param units - Nonempty normalized escape interval.
 * @returns Frozen byte hull of all contributing original source units.
 */
function contributorRange(
  source: SourceProcessingResult,
  contentStart: number,
  units: readonly NormalizedScalar[],
): ByteRange {
  let start = Infinity;
  let end = -Infinity;
  for (const unit of units) {
    for (const offset of unit.inputOffsets) {
      const range = source.units[contentStart + offset]!.byteRange;
      start = Math.min(start, range.start);
      end = Math.max(end, range.end);
    }
  }
  return Object.freeze({ start, end });
}
