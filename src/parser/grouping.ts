/**
 * Build recursive delimiter groups and minimally alternate recognized
 * operands/operators without applying precedence or final error classification.
 * @module
 */
import type {
  CoreStructureDiagnostic,
  CstEntry,
  CstError,
  CstGroup,
  CstSequence,
  CoreStructureResult,
  GroupingDiagnostic,
} from "../cst/cst.js";
import type { CoreLexResult, CoreToken, CoreTrivia,
  UnsupportedCoreRegion } from "../lexer/core-lexer.js";
import type { ByteRange } from "../source/source-input.js";

/** Span and spelling of a synthetic closing delimiter inserted at EOF. */
interface SyntheticDelimiter {
  /** Expected closer spelling. */
  readonly spelling: string;
  /** Zero-width original-byte EOF span. */
  readonly span: ByteRange;
  /** Marks the absence of an original source token. */
  readonly synthetic: true;
}

/** Mutable frame used while matching one opener and its contained source. */
interface GroupFrame {
  /** Opening token, absent for the file-level sequence. */
  readonly open?: CoreToken;
  /** Expected closer corresponding to the opener. */
  readonly expectedClose?: string;
  /** Unfinalized source and structural entries. */
  readonly entries: CstEntry[];
}

/** Matching closer for each recognized opening delimiter spelling. */
const closingDelimiter: Readonly<Record<string, string>> = Object.freeze({
  "(": ")",
  "[": "]",
  "{": "}",
});

/** Recognized closing delimiter spellings. */
const openingDelimiter: Readonly<Record<string, string>> = Object.freeze({
  ")": "(",
  "]": "[",
  "}": "{",
});

/**
 * Group delimiters, preserve lexical diagnostics, and insert only the basic
 * `APPLY`/`EMPTY` alternation elements. Lexical errors remain explicit entries;
 * only a role already supplied by the lexer is used, and errors are not collapsed
 * or assigned contextual operator roles here.
 * @param lexed - Lossless lexer result whose items are ordered in source order.
 * @returns Grouped structural entries and all original plus recovery diagnostics.
 */
export function structureCore(lexed: CoreLexResult): CoreStructureResult {
  const end = lexed.source.originalRange(
    lexed.source.units.length,
    lexed.source.units.length,
  ).end;
  const frames: GroupFrame[] = [{ entries: [] }];
  const diagnostics: GroupingDiagnostic[] = [];

  for (const item of lexed.items) {
    const frame = frames[frames.length - 1]!;
    if (item.kind === "trivia") {
      frame.entries.push(triviaEntry(item));
      continue;
    }

    if (item.kind === "token" && item.tokenKind === "delimiter") {
      const expectedClose = closingDelimiter[item.spelling];
      if (expectedClose !== undefined) {
        frames.push({ open: item, expectedClose, entries: [] });
        continue;
      }

      const matchingOpen = openingDelimiter[item.spelling];
      if (matchingOpen !== undefined && frame.open &&
        frame.open.spelling === matchingOpen) {
        frames.pop();
        const group = finishGroup(frame, item, false, diagnostics);
        frames[frames.length - 1]!.entries.push(group);
        continue;
      }

      frame.entries.push(unexpectedCloser(item));
      diagnostics.push(Object.freeze({
        code: "unexpected-closing-delimiter",
        severity: "error",
        message: frame.open
          ? `Closing delimiter ${item.spelling} does not match the innermost open delimiter.`
          : `Closing delimiter ${item.spelling} has no open delimiter.`,
        location: item.range.bytes,
        actual: item.spelling,
      }));
      continue;
    }

    frame.entries.push(sourceEntry(item));
  }

  while (frames.length > 1) {
    const frame = frames.pop()!;
    const expected = frame.expectedClose!;
    const close = syntheticDelimiter(expected, end);
    const group = finishGroup(frame, close, true, diagnostics);
    frames[frames.length - 1]!.entries.push(group);
  }

  const root = finishSequence(frames[0]!.entries, 0, end, end);
  const allDiagnostics: CoreStructureDiagnostic[] = [
    ...lexed.diagnostics,
    ...diagnostics,
  ];
  allDiagnostics.sort((left, right) =>
    left.location.start - right.location.start ||
    left.location.end - right.location.end
  );
  return Object.freeze({
    root,
    diagnostics: Object.freeze(allDiagnostics),
  });
}

/**
 * Finalize one matched or EOF-recovered group and report its source extent.
 * @param frame - Group frame containing source items between its delimiters.
 * @param close - Source closer or inserted zero-width EOF closer.
 * @param missing - Whether a missing-closer diagnostic is required.
 * @param diagnostics - Accumulator for nested missing-closer diagnostics.
 * @returns A group operand appended to its parent's sequence.
 */
function finishGroup(
  frame: GroupFrame,
  close: CoreToken | SyntheticDelimiter,
  missing: boolean,
  diagnostics: GroupingDiagnostic[],
): CstGroup {
  const open = frame.open!;
  const delimiter = "kind" in close
    ? Object.freeze({
        spelling: close.spelling,
        span: close.range.bytes,
        synthetic: false,
        token: close,
      })
    : close;
  if (missing) {
    diagnostics.push(Object.freeze({
      code: "missing-closing-delimiter",
      severity: "error",
      message: `Missing closing delimiter ${delimiter.spelling} at end of input.`,
      location: delimiter.span,
      expected: delimiter.spelling,
    }));
  }
  const contents = finishSequence(
    frame.entries,
    open.range.bytes.end,
    delimiter.span.start,
    delimiter.span.start,
  );
  return Object.freeze({
    kind: "group",
    open,
    contents,
    close: delimiter,
    span: Object.freeze({
      start: open.range.bytes.start,
      end: delimiter.span.end,
    }),
  });
}

/**
 * Insert minimal alternation elements into one file/group sequence.
 * @param sourceEntries - Source entries in original order, before implicit nodes.
 * @param spanStart - Inclusive original-byte sequence boundary.
 * @param spanEnd - Exclusive original-byte sequence boundary.
 * @param emptyAnchor - Optional anchor for an empty group, normally its closer.
 * @returns Frozen shallow sequence whose trivia remains in source order.
 */
function finishSequence(
  sourceEntries: readonly CstEntry[],
  spanStart: number,
  spanEnd: number,
  emptyAnchor = spanEnd,
): CstSequence {
  const meaningful = sourceEntries.filter((entry) => entry.kind !== "trivia");
  if (meaningful.length === 0) {
    const entries = [
      ...sourceEntries,
      emptyOperand(emptyAnchor),
    ];
    return Object.freeze({
      entries: Object.freeze(entries),
      span: Object.freeze({ start: spanStart, end: spanEnd }),
    });
  }

  const output: CstEntry[] = [];
  let previousKind: "operand" | "operator" | undefined;
  let previousOutputIndex = -1;
  let previousSpan: ByteRange | undefined;
  let firstSignificant = true;

  for (const entry of sourceEntries) {
    if (entry.kind === "trivia") {
      output.push(entry);
      continue;
    }

    const currentKind = alternationKind(entry);
    if (currentKind === undefined) {
      output.push(entry);
      previousKind = undefined;
      previousSpan = undefined;
      firstSignificant = false;
      continue;
    }

    if (firstSignificant && currentKind === "operator") {
      output.push(emptyOperand(entry.span.start));
    } else if (previousKind !== undefined && previousKind === currentKind) {
      output.push(currentKind === "operand"
        ? applyOperator(entry.span.start)
        : emptyOperand(entry.span.start));
    }

    output.push(entry);
    previousKind = currentKind;
    previousSpan = entry.span;
    previousOutputIndex = output.length - 1;
    firstSignificant = false;
  }

  if (previousKind === "operator" && previousSpan) {
    output.splice(previousOutputIndex + 1, 0, emptyOperand(previousSpan.end));
  }

  return Object.freeze({
    entries: Object.freeze(output),
    span: Object.freeze({ start: spanStart, end: spanEnd }),
  });
}

/**
 * Map an entry to its role for basic implicit alternation.
 * Known-role operand errors act as operands; unresolved errors have no role.
 * @param entry - One structural entry.
 * @returns Operand/operator role, or undefined when the entry has no role.
 */
function alternationKind(entry: CstEntry): "operand" | "operator" | undefined {
  if (entry.kind === "operand" || entry.kind === "group") return "operand";
  if (entry.kind === "operator") return "operator";
  if (entry.kind === "error" && entry.errorRole === "operand") return "operand";
  return undefined;
}

/**
 * Preserve one trivia item and its original byte span.
 * @param source - Original lexer trivia.
 * @returns Structural trivia entry.
 */
function triviaEntry(source: CoreTrivia): CstEntry {
  return Object.freeze({
    kind: "trivia",
    source,
    span: source.range.bytes,
  });
}

/**
 * Convert a source token or fallback region into its structural entry.
 * @param source - Non-delimiter lexer token or unsupported region.
 * @returns Explicit operator, source operand, or unresolved lexer error.
 */
function sourceEntry(
  source: CoreToken | UnsupportedCoreRegion,
): CstEntry {
  if (source.kind === "unsupported" ||
    (source.kind === "token" && source.tokenKind === "error")) {
    return Object.freeze({
      kind: "error",
      errorKind: "lexer",
      errorRole: source.kind === "token" && source.errorRole === "operand"
        ? "operand"
        : "unresolved",
      source,
      span: source.range.bytes,
    }) satisfies CstError;
  }
  if (source.tokenKind === "operator") {
    return Object.freeze({
      kind: "operator",
      operatorKind: "explicit",
      token: source,
      span: source.range.bytes,
      synthetic: false,
    });
  }
  return Object.freeze({
    kind: "operand",
    operandKind: "token",
    token: source,
    span: source.range.bytes,
  });
}

/**
 * Preserve a closer that does not match the innermost open delimiter.
 * @param token - Unexpected source closer.
 * @returns An unresolved error entry retaining the lexer token.
 */
function unexpectedCloser(token: CoreToken): CstError {
  return Object.freeze({
    kind: "error",
    errorKind: "unexpected-closer",
    errorRole: "unresolved",
    source: token,
    span: token.range.bytes,
  });
}

/**
 * Construct a zero-width inserted EMPTY operand.
 * @param anchor - Original-byte offset selected by the DEC-088 policy.
 * @returns Frozen synthetic operand with no source bytes.
 */
function emptyOperand(anchor: number): CstEntry {
  return Object.freeze({
    kind: "operand",
    operandKind: "empty",
    spelling: "EMPTY",
    span: Object.freeze({ start: anchor, end: anchor }),
    synthetic: true,
  });
}

/**
 * Construct a zero-width inserted APPLY operator.
 * @param anchor - Original-byte offset at the following operand.
 * @returns Frozen synthetic operator with no source bytes.
 */
function applyOperator(anchor: number): CstEntry {
  return Object.freeze({
    kind: "operator",
    operatorKind: "apply",
    spelling: "APPLY",
    span: Object.freeze({ start: anchor, end: anchor }),
    synthetic: true,
  });
}

/**
 * Construct an inserted expected closer at original-byte EOF.
 * @param spelling - Expected delimiter spelling.
 * @param end - Original-byte EOF offset.
 * @returns Synthetic delimiter data without a fabricated source token.
 */
function syntheticDelimiter(
  spelling: string,
  end: number,
): SyntheticDelimiter {
  return Object.freeze({
    spelling,
    span: Object.freeze({ start: end, end }),
    synthetic: true as const,
  });
}
