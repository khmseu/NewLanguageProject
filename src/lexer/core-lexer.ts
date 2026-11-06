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

export type CoreTokenKind = "identifier" | "operator" | "delimiter";
export type CoreTriviaKind = "bom" | "whitespace" | "line-comment" | "block-comment";
export type DeferredSurfaceKind = "numeric" | "literal";

export interface CoreSourceRange {
  readonly unitStart: number;
  readonly unitEnd: number;
  readonly bytes: ByteRange;
}

export interface CoreIdentifier {
  readonly translatedText: string;
  readonly displayName: string;
  readonly lookupName: string;
}

export interface CoreToken {
  readonly kind: "token";
  readonly tokenKind: CoreTokenKind;
  readonly spelling: string;
  readonly range: CoreSourceRange;
  readonly nextUnitOffset: number;
  readonly identifier?: CoreIdentifier;
}

export interface CoreTrivia {
  readonly kind: "trivia";
  readonly triviaKind: CoreTriviaKind;
  readonly spelling: string;
  readonly range: CoreSourceRange;
  readonly nextUnitOffset: number;
  readonly terminated?: boolean;
}

export interface DeferredCoreRegion {
  readonly kind: "deferred";
  readonly surfaceKind: DeferredSurfaceKind;
  readonly spelling: string;
  readonly range: CoreSourceRange;
  readonly nextUnitOffset: number;
  readonly coverage?: "unscanned-suffix";
}

export interface UnsupportedCoreRegion {
  readonly kind: "unsupported";
  readonly codePoint: number;
  readonly spelling: string;
  readonly range: CoreSourceRange;
  readonly nextUnitOffset: number;
}

export type CoreLexerDiagnostic =
  | SourceProcessingDiagnostic
  | ErrorDiagnostic<"unterminated-block-comment" | "unrecognized-character">;

export type CoreScanStep =
  | CoreToken
  | CoreTrivia
  | DeferredCoreRegion
  | UnsupportedCoreRegion
  | { readonly kind: "eof"; readonly unitOffset: number };

export interface CoreLexResult {
  readonly source: SourceProcessingResult;
  readonly items: readonly (CoreToken | CoreTrivia | DeferredCoreRegion | UnsupportedCoreRegion)[];
  readonly diagnostics: readonly CoreLexerDiagnostic[];
  readonly status:
    | "complete"
    | "deferred"
    | "unsupported"
    | "deferred-and-unsupported";
}

const operators = [
  "<<=", ">>=", "::=", "++", "--", "**", "<<", ">>", "<=", ">=", "==",
  "!=", "&&", "||", "<-", "->", ":=", "+=", "-=", "*=", "/=", "%=",
  "&=", "|=", "^=", "::", "!", "~", "*", "/", "%", "+", "-", "&", "^",
  "|", "<", ">", "=", ":", "?", ".", "@", ",", ";",
].sort((left, right) => right.length - left.length);

const delimiters = new Set(["(", ")", "{", "}", "[", "]"]);
const hardBreaks = new Set([0x0a, 0x0d, 0x85, 0x0b, 0x0c, 0x2028, 0x2029]);

export function scanCoreAt(
  source: SourceProcessingResult,
  unitOffset: number,
): CoreScanStep {
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
      !hardBreaks.has(source.units[end]!.codePoint)
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

  if (codePoint >= 0x30 && codePoint <= 0x39) {
    return makeDeferred(source, unitOffset, "numeric");
  }
  if (character === "." && next !== undefined && next >= 0x30 && next <= 0x39) {
    return makeDeferred(source, unitOffset, "numeric");
  }
  if (character === "'" || character === '"' || character === "`") {
    return makeDeferred(source, unitOffset, "literal");
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

export function lexCore(input: SourceInput): CoreLexResult {
  const source = processSource(input);
  const items: Array<
    CoreToken | CoreTrivia | DeferredCoreRegion | UnsupportedCoreRegion
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
    if (step.kind === "deferred") {
      const suffix = sourceRange(source, unitOffset, source.units.length);
      items.push(Object.freeze({
        ...step,
        spelling: translatedText(source, unitOffset, source.units.length),
        range: suffix,
        nextUnitOffset: source.units.length,
        coverage: "unscanned-suffix",
      }));
      status = encounteredUnsupported ? "deferred-and-unsupported" : "deferred";
      break;
    }
    items.push(step);
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

function isWhiteSpace(codePoint: number): boolean {
  return whiteSpace.test(String.fromCodePoint(codePoint));
}

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

function makeDeferred(
  source: SourceProcessingResult,
  offset: number,
  surfaceKind: DeferredSurfaceKind,
): DeferredCoreRegion {
  return Object.freeze({
    kind: "deferred",
    surfaceKind,
    spelling: source.units[offset]!.character,
    range: sourceRange(source, offset, offset + 1),
    nextUnitOffset: offset + 1,
  });
}

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
