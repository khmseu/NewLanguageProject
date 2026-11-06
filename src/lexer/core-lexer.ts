/**
 * Lossless lexer over translated scalar units, including literal and numeric values.
 * Parser-level error classification is not performed here.
 * @module
 */
import type { ByteRange } from "../source/source-input.js";
import { SourceInput } from "../source/source-input.js";
import { normalizeUnicode18 } from "../source/unicode-normalization.js";
import type {
  SourceProcessingDiagnostic,
  SourceProcessingResult,
} from "../source/source-processing.js";
import { processSource } from "../source/source-processing.js";
import { isXidContinue, isXidStart } from "../source/unicode-data.js";
import type { ErrorDiagnostic } from "../diagnostics/diagnostic.js";
import whiteSpace from "@unicode/unicode-18.0.0/Binary_Property/White_Space/regex.mjs";
import { scanLiteralAt, type CoreLiteral, type LiteralDiagnostic } from "./literal-scanner.js";
import { isHardLineBreak } from "../source/line-endings.js";
import { scanNumericAt, type CoreNumber } from "./numeric-scanner.js";

/** Recognized core token families; there are no keyword token kinds. */
export type CoreTokenKind = "identifier" | "operator" | "delimiter"
  | "character" | "string" | "raw-string" | "number" | "error";
/** Preserved non-token input, including a byte-only initial BOM. */
export type CoreTriviaKind = "bom" | "whitespace" | "line-comment" | "block-comment";

/** Corresponding half-open translated-scalar and original-byte extents. */
export interface CoreSourceRange {
  /** Inclusive scalar-unit index, not a UTF-16 string offset. */
  readonly unitStart: number;
  /** Exclusive scalar-unit index; initial BOM trivia has no units. */
  readonly unitEnd: number;
  /** Original byte coverage, including escape spellings and malformed bytes. */
  readonly bytes: ByteRange;
}

/** Identifier spellings normalized independently from the whole source. */
export interface CoreIdentifier {
  /** Escape-translated spelling without normalization. */
  readonly translatedText: string;
  /** Unicode 18 NFC user-facing name. */
  readonly displayName: string;
  /** Unicode 18 NFKC lookup key; no case folding is applied. */
  readonly lookupName: string;
}

/** Frozen token; identifier/literal metadata is separately frozen when present. */
export interface CoreToken {
  /** Discriminates recognized tokens from trivia and incomplete work. */
  readonly kind: "token";
  /** Core syntax family; invalid literal candidates use error with operand role. */
  readonly tokenKind: CoreTokenKind;
  /** Translated text, not the original byte spelling of Unicode escapes. */
  readonly spelling: string;
  /** Frozen scalar-unit and byte coverage. */
  readonly range: CoreSourceRange;
  /** Exclusive consumed scalar-unit offset for subsequent scanning. */
  readonly nextUnitOffset: number;
  /** Present only on identifier tokens, holding display and lookup forms. */
  readonly identifier?: CoreIdentifier;
  /** Present on character, string, raw-string, and malformed literal tokens. */
  readonly literal?: CoreLiteral;
  /** Present on individual numeric candidates, valid or invalid. */
  readonly numeric?: CoreNumber;
  /** Diagnostic for a malformed numeric candidate or touching operand run. */
  readonly lexicalDiagnostic?: ErrorDiagnostic<"invalid-number" | "touching-operands">;
  /** Malformed literals are operands for later parser insertion, not operators. */
  readonly errorRole?: "operand";
}

/** Frozen preserved trivia; comments are recognized after global escape translation. */
export interface CoreTrivia {
  /** Discriminates trivia from tokens and fallback runs. */
  readonly kind: "trivia";
  /** BOM, pinned Unicode whitespace, or a non-nesting comment. */
  readonly triviaKind: CoreTriviaKind;
  /** Translated text; empty for the byte-only initial BOM. */
  readonly spelling: string;
  /** Original coverage; BOM occupies bytes [0, 3) but zero units. */
  readonly range: CoreSourceRange;
  /** Exclusive consumed scalar-unit offset; zero for initial BOM. */
  readonly nextUnitOffset: number;
  /** Present only for block comments; false means EOF arrived before closure. */
  readonly terminated?: boolean;
}

/** Frozen shortest fallback run; malformed Unicode units remain separate. */
export interface UnsupportedCoreRegion {
  /** Signals a fallback error region. */
  readonly kind: "unsupported";
  /** First unsupported translated scalar value. */
  readonly codePoint: number;
  /** Translated fallback text. */
  readonly spelling: string;
  /** Frozen original-byte and translated-unit coverage of the run. */
  readonly range: CoreSourceRange;
  /** Exclusive scalar-unit offset, permitting recovery scanning. */
  readonly nextUnitOffset: number;
}

/** Source-recovery errors plus aggregate lexing errors; all locations are bytes. */
export type CoreLexerDiagnostic =
  | SourceProcessingDiagnostic
  | LiteralDiagnostic
  | ErrorDiagnostic<"unterminated-block-comment" | "unrecognized-character" | "invalid-number" | "touching-operands">;

/** One direct scan outcome; EOF consumes no units and does not add diagnostics. */
export type CoreScanStep =
  | CoreToken
  | CoreTrivia
  | UnsupportedCoreRegion
  | {
      /** Indicates that the requested offset equals the translated unit count. */
      readonly kind: "eof";
      /** EOF scalar-unit offset, not a byte or UTF-16 offset. */
      readonly unitOffset: number;
    };

/** Frozen aggregate containers; diagnostic objects are not uniformly deep-frozen. */
export interface CoreLexResult {
  /** Full translated source and its byte provenance. */
  readonly source: SourceProcessingResult;
  /** Frozen ordered items covering the original input. */
  readonly items: readonly (CoreToken | CoreTrivia | UnsupportedCoreRegion)[];
  /** Frozen byte-ordered list, including source errors inside other items. */
  readonly diagnostics: readonly CoreLexerDiagnostic[];
  /**
   * Scanning coverage/unsupported-character status, not diagnostic success:
   * complete can still contain source, numeric, comment, or literal errors;
   * unsupported means fallback characters were encountered.
   */
  readonly status:
    | "complete"
    | "unsupported";
}

/** Fixed operator spellings, stably sorted longest-first for maximal matching. */
const operators = [
  "<<=", ">>=", "::=", "++", "--", "**", "<<", ">>", "<=", ">=", "==",
  "!=", "&&", "||", "<-", "->", ":=", "+=", "-=", "*=", "/=", "%=",
  "&=", "|=", "^=", "::", "!", "~", "*", "/", "%", "+", "-", "&", "^",
  "|", "<", ">", "=", ":", "?", ".", "@", ",", ";",
].sort((left, right) => right.length - left.length);

/** Single-character grouping delimiters; matching pairs are not checked here. */
const delimiters = new Set(["(", ")", "{", "}", "[", "]"]);
/**
 * Scan one core item without accumulating source diagnostics or normalizing source
 * text. Touching identifier/numeric candidates become one error operand.
 * @param source - Already processed source, assumed to satisfy its unit contracts.
 * @param unitOffset - Inclusive translated scalar-unit index; EOF is allowed.
 * @returns One token/trivia/unsupported item, or EOF. No source mutation occurs.
 * @throws {RangeError} If unitOffset is nonintegral or outside the unit sequence.
 */
export function scanCoreAt(
  source: SourceProcessingResult,
  unitOffset: number,
): CoreScanStep {
  const first = scanSingleAt(source, unitOffset);
  if (first.kind === "unsupported") {
    let end = first.nextUnitOffset;
    if (!source.units[unitOffset]!.isError) {
      while (end < source.units.length && !source.units[end]!.isError &&
        scanSingleAt(source, end).kind === "unsupported") end++;
    }
    return Object.freeze({ ...first, spelling: translatedText(source, unitOffset, end),
      range: sourceRange(source, unitOffset, end), nextUnitOffset: end });
  }
  if (first.kind !== "token" || !(first.tokenKind === "identifier" || first.numeric)) return first;
  let end = first.nextUnitOffset;
  while (end < source.units.length) {
    const next = scanSingleAt(source, end);
    if (next.kind !== "token" || !(next.tokenKind === "identifier" || next.numeric)) break;
    end = next.nextUnitOffset;
  }
  if (end === first.nextUnitOffset) return first;
  const range = sourceRange(source, unitOffset, end);
  return Object.freeze({
    kind: "token", tokenKind: "error", errorRole: "operand",
    spelling: translatedText(source, unitOffset, end), range, nextUnitOffset: end,
    lexicalDiagnostic: Object.freeze({ code: "touching-operands", severity: "error",
      message: "Identifier and numeric operands cannot touch.", location: range.bytes }),
  });
}

/**
 * Scan one candidate before touching-run and fallback aggregation.
 * @param source - Translated source.
 * @param unitOffset - Inclusive scalar-unit offset, or EOF.
 * @returns One unaggregated scan step.
 * @throws {RangeError} If the offset is invalid.
 */
function scanSingleAt(source: SourceProcessingResult, unitOffset: number): CoreScanStep {
  if (!Number.isInteger(unitOffset) || unitOffset < 0 || unitOffset > source.units.length) {
    throw new RangeError(`Invalid translated-source offset ${unitOffset}`);
  }
  if (unitOffset === source.units.length) return { kind: "eof", unitOffset };

  const first = source.units[unitOffset]!;
  const character = first.character;
  const codePoint = first.codePoint;
  const next = source.units[unitOffset + 1]?.codePoint;

  if (isWhiteSpace(codePoint)) {
    let end = unitOffset + 1;
    while (end < source.units.length && isWhiteSpace(source.units[end]!.codePoint)) {
      if (
        source.units[end - 1]!.codePoint === 0x0d &&
        source.units[end]!.codePoint === 0x0a
      ) {
        end += 1;
        continue;
      }
      if (source.units[end]!.codePoint === 0x0a && source.units[end - 1]!.codePoint === 0x0d) {
        break;
      }
      end += 1;
    }
    return makeTrivia(source, unitOffset, end, "whitespace");
  }

  if (character === "/" && next === 0x2f) {
    let end = unitOffset + 2;
    while (
      end < source.units.length &&
      !isHardLineBreak(source.units[end]!.codePoint)
    ) {
      end += 1;
    }
    return makeTrivia(source, unitOffset, end, "line-comment");
  }

  if (character === "/" && next === 0x2a) {
    let end = unitOffset + 2;
    while (end + 1 < source.units.length) {
      if (
        source.units[end]!.codePoint === 0x2a &&
        source.units[end + 1]!.codePoint === 0x2f
      ) {
        return makeTrivia(source, unitOffset, end + 2, "block-comment", true);
      }
      end += 1;
    }
    return makeTrivia(
      source,
      unitOffset,
      source.units.length,
      "block-comment",
      false,
    );
  }

  if (isXidStart(codePoint)) {
    let end = unitOffset + 1;
    while (
      end < source.units.length &&
      isXidContinue(source.units[end]!.codePoint)
    ) {
      end += 1;
    }
    const spelling = translatedText(source, unitOffset, end);
    return Object.freeze({
      kind: "token",
      tokenKind: "identifier",
      spelling,
      range: sourceRange(source, unitOffset, end),
      nextUnitOffset: end,
      identifier: Object.freeze({
        translatedText: spelling,
        displayName: normalizeUnicode18(spelling, "NFC"),
        lookupName: normalizeUnicode18(spelling, "NFKC"),
      }),
    });
  }

  if (delimiters.has(character)) {
    return makeToken(source, unitOffset, unitOffset + 1, "delimiter");
  }

  const number = scanNumericAt(source, unitOffset);
  if (number !== undefined) {
    const range = sourceRange(source, unitOffset, number.end);
    return Object.freeze({
      kind: "token", tokenKind: number.numeric.valid ? "number" : "error",
      spelling: translatedText(source, unitOffset, number.end), range,
      nextUnitOffset: number.end, numeric: number.numeric,
      ...(number.numeric.valid ? {} : {
        errorRole: "operand" as const,
        lexicalDiagnostic: Object.freeze({ code: "invalid-number" as const,
          severity: "error" as const, message: "Invalid numeric literal.", location: range.bytes }),
      }),
    });
  }
  if (character === "'" || character === '"' || character === "`") {
    const candidate = scanLiteralAt(source, unitOffset);
    if (candidate !== undefined) {
      const literal = candidate.literal;
      return Object.freeze({
        kind: "token",
        tokenKind: literal.valid ? literal.kind : "error",
        spelling: translatedText(source, unitOffset, candidate.end),
        range: sourceRange(source, unitOffset, candidate.end),
        nextUnitOffset: candidate.end,
        literal,
        ...(literal.valid ? {} : { errorRole: "operand" as const }),
      });
    }
  }

  const spelling = operators.find((operator) =>
    matchesAt(source, unitOffset, operator),
  );
  if (spelling !== undefined) {
    return makeToken(
      source,
      unitOffset,
      unitOffset + [...spelling].length,
      "operator",
    );
  }

  return Object.freeze({
    kind: "unsupported",
    codePoint,
    spelling: character,
    range: sourceRange(source, unitOffset, unitOffset + 1),
    nextUnitOffset: unitOffset + 1,
  });
}

/**
 * Process bytes and scan the implemented core, preserving a leading BOM as trivia.
 * Scan the whole source. Fallback, comment, literal, numeric and source errors
 * are reported independently of coverage status.
 * @param input - Original bytes, left unchanged.
 * @returns Frozen result and item/diagnostic arrays, with diagnostics sorted by byte start.
 */
export function lexCore(input: SourceInput): CoreLexResult {
  const source = processSource(input);
  const items: Array<
    CoreToken | CoreTrivia | UnsupportedCoreRegion
  > = [];
  const diagnostics: CoreLexerDiagnostic[] = [...source.diagnostics];
  const initialBytes = input.bytes;
  if (
    initialBytes.length >= 3 &&
    initialBytes[0] === 0xef &&
    initialBytes[1] === 0xbb &&
    initialBytes[2] === 0xbf
  ) {
    items.push(Object.freeze({
      kind: "trivia",
      triviaKind: "bom",
      spelling: "",
      range: Object.freeze({
        unitStart: 0,
        unitEnd: 0,
        bytes: input.range(0, 3),
      }),
      nextUnitOffset: 0,
    }));
  }

  let unitOffset = 0;
  let encounteredUnsupported = false;
  let status: CoreLexResult["status"] = "complete";
  while (unitOffset < source.units.length) {
    const step = scanCoreAt(source, unitOffset);
    if (step.kind === "eof") break;
    items.push(step);
    if (step.kind === "token" && step.literal !== undefined) {
      diagnostics.push(...step.literal.diagnostics);
    }
    if (step.kind === "token" && step.lexicalDiagnostic !== undefined) {
      diagnostics.push(step.lexicalDiagnostic);
    }
    if (step.kind === "unsupported") {
      encounteredUnsupported = true;
      diagnostics.push({
        code: "unrecognized-character",
        severity: "error",
        message: `No core token is defined for U+${step.codePoint.toString(16).toUpperCase().padStart(4, "0")}.`,
        location: step.range.bytes,
      });
    } else if (
      step.kind === "trivia" &&
      step.triviaKind === "block-comment" &&
      step.terminated === false
    ) {
      diagnostics.push({
        code: "unterminated-block-comment",
        severity: "error",
        message: "Block comment is not terminated before end of file.",
        location: step.range.bytes,
      });
    }
    unitOffset = step.nextUnitOffset;
  }
  if (status === "complete" && encounteredUnsupported) status = "unsupported";
  diagnostics.sort((left, right) => left.location.start - right.location.start);
  return Object.freeze({
    source,
    items: Object.freeze(items),
    diagnostics: Object.freeze(diagnostics),
    status,
  });
}

/**
 * Test the pinned Unicode 18 White_Space property.
 * @param codePoint - Valid scalar supplied by source processing.
 * @returns Whether the scalar is whitespace; BOM is not included.
 * @throws {RangeError} If a caller supplies a value outside String.fromCodePoint's range.
 */
function isWhiteSpace(codePoint: number): boolean {
  return whiteSpace.test(String.fromCodePoint(codePoint));
}

/**
 * Pair translated indices with their covering original-byte range.
 * @param source - Processed source with original-byte mapping.
 * @param start - Inclusive scalar-unit offset.
 * @param end - Exclusive scalar-unit offset.
 * @returns Frozen range referencing frozen byte bounds.
 * @throws {RangeError} If source.originalRange rejects the bounds.
 */
function sourceRange(
  source: SourceProcessingResult,
  start: number,
  end: number,
): CoreSourceRange {
  return Object.freeze({
    unitStart: start,
    unitEnd: end,
    bytes: source.originalRange(start, end),
  });
}

/**
 * Join translated unit characters without normalization or original-byte decoding.
 * @param source - Processed source.
 * @param start - Inclusive unit offset, assumed valid by internal callers.
 * @param end - Exclusive unit offset, assumed valid by internal callers.
 * @returns Text whose UTF-16 length may exceed its scalar-unit count.
 */
function translatedText(
  source: SourceProcessingResult,
  start: number,
  end: number,
): string {
  return source.units
    .slice(start, end)
    .map((unit) => unit.character)
    .join("");
}

/**
 * Construct a frozen trivia item over a known translated interval.
 * @param source - Processed source.
 * @param start - Inclusive scalar-unit offset.
 * @param end - Exclusive scalar-unit offset.
 * @param triviaKind - Trivia classification.
 * @param terminated - Block-comment closure flag; omitted for other trivia.
 * @returns Frozen item with translated spelling and original-byte coverage.
 * @throws {RangeError} If the original-range mapping rejects the bounds.
 */
function makeTrivia(
  source: SourceProcessingResult,
  start: number,
  end: number,
  triviaKind: CoreTriviaKind,
  terminated?: boolean,
): CoreTrivia {
  return Object.freeze({
    kind: "trivia",
    triviaKind,
    spelling: translatedText(source, start, end),
    range: sourceRange(source, start, end),
    nextUnitOffset: end,
    ...(terminated === undefined ? {} : { terminated }),
  });
}

/**
 * Construct a frozen non-identifier token over a recognized interval.
 * @param source - Processed source.
 * @param start - Inclusive scalar-unit offset.
 * @param end - Exclusive scalar-unit offset.
 * @param tokenKind - Operator or delimiter classification.
 * @returns Frozen token with no identifier metadata.
 * @throws {RangeError} If the original-range mapping rejects the bounds.
 */
function makeToken(
  source: SourceProcessingResult,
  start: number,
  end: number,
  tokenKind: "operator" | "delimiter",
): CoreToken {
  return Object.freeze({
    kind: "token",
    tokenKind,
    spelling: translatedText(source, start, end),
    range: sourceRange(source, start, end),
    nextUnitOffset: end,
  });
}

/**
 * Compare an operator spelling with translated units at a given position.
 * This helper relies on the operator table being ASCII: spelling.length and
 * spelling[index] use UTF-16 code units, whereas source offsets count scalars.
 * @param source - Processed source.
 * @param offset - In-bounds scalar-unit start.
 * @param spelling - ASCII operator candidate.
 * @returns Whether all spelling characters match without exceeding source units.
 */
function matchesAt(
  source: SourceProcessingResult,
  offset: number,
  spelling: string,
): boolean {
  if (offset + spelling.length > source.units.length) return false;
  for (let index = 0; index < spelling.length; index += 1) {
    if (source.units[offset + index]!.character !== spelling[index]) return false;
  }
  return true;
}
