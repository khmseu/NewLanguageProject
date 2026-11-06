/**
 * Build delimiter groups, collapse consecutive errors, select roles under
 * DEC-092/DEC-068, and minimally alternate operands/operators without applying
 * precedence. Every pass is linear in the scope's entries and non-recursive.
 * @module
 */
import type {
  CoreStructureDiagnostic,
  CstEntry,
  CstError,
  CstErrorComponent,
  CstErrorPart,
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

/** A not-yet-collapsed error unit, internal to one scope's recovery pass. */
interface RawError {
  /** Discriminates the unit from final CST entries. */
  readonly kind: "raw-error";
  /** Original error unit. */
  readonly part: CstErrorPart;
}

/** A maximal error run found by collapse and awaiting its contextual role. */
interface PendingError {
  /** Discriminates the run from final CST entries. */
  readonly kind: "pending-error";
  /** Ordered parts and interior trivia, appended while the run grows. */
  readonly components: CstErrorComponent[];
  /** True when any part has a fixed lexical operand role (DEC-092). */
  forcedOperand: boolean;
}

/** One source item inside a frame before recovery. */
type FrameEntry = CstEntry | RawError;

/** Mutable frame used while matching one opener and its contained source. */
interface GroupFrame {
  /** Opening token, absent for the file-level sequence. */
  readonly open?: CoreToken;
  /** Expected closer corresponding to the opener. */
  readonly expectedClose?: string;
  /** Unfinalized source and structural entries. */
  readonly entries: FrameEntry[];
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
 * `APPLY`/`EMPTY` alternation elements. Within each scope, consecutive errors
 * collapse across trivia (DEC-079/087). DEC-092 keeps a run containing a
 * lexically designated operand fixed as an operand; DEC-068 contextually
 * classifies other runs. Each constituent diagnostic is retained.
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
 * Recover one file/group sequence: collapse consecutive errors, choose their
 * roles, then insert the minimal alternation elements.
 * @param sourceEntries - Source entries in original order, before implicit nodes.
 * @param spanStart - Inclusive original-byte sequence boundary.
 * @param spanEnd - Exclusive original-byte sequence boundary.
 * @param emptyAnchor - Original-byte position for an inserted empty operand if
 * the scope contains no source operands or operators (normally the group closer).
 * @returns Frozen shallow sequence whose trivia remains in source order.
 */
function finishSequence(
  sourceEntries: readonly FrameEntry[],
  spanStart: number,
  spanEnd: number,
  emptyAnchor = spanEnd,
): CstSequence {
  const slots = collapseErrors(sourceEntries);
  const significant = slots.filter((slot) =>
    !(slot.kind === "trivia")
  );
  const span = Object.freeze({ start: spanStart, end: spanEnd });
  if (significant.length === 0) {
    return Object.freeze({
      entries: Object.freeze([...(slots as CstEntry[]), emptyOperand(emptyAnchor)]),
      span,
    });
  }

  // Collapse guarantees that no two pending errors are neighbors. DEC-092
  // fixes designated operand runs; DEC-068 independently minimizes each other
  // run against its fixed neighbors. Insertions are then minimal subject to
  // those role constraints.
  const roles = new Map<PendingError, CstError["errorRole"]>();
  significant.forEach((slot, index) => {
    if (slot.kind !== "pending-error") return;
    const previous = index === 0 ? "operator" : fixedKind(significant[index - 1]!);
    const next = index === significant.length - 1
      ? "operator"
      : fixedKind(significant[index + 1]!);
    const asOperand = Number(previous === "operand") + Number(next === "operand");
    const asOperator = Number(previous === "operator") + Number(next === "operator");
    roles.set(
      slot,
      !slot.forcedOperand && asOperator < asOperand ? "operator" : "operand",
    );
  });

  const output: CstEntry[] = [];
  let previousKind: "operand" | "operator" = "operator";
  let previousSpan: ByteRange | undefined;
  let previousOutputIndex = -1;

  for (const slot of slots) {
    const entry = slot.kind === "pending-error"
      ? finishError(slot, roles.get(slot)!)
      : slot;
    if (entry.kind === "trivia") {
      output.push(entry);
      continue;
    }
    const currentKind = alternationKind(entry);
    if (previousKind === currentKind) {
      output.push(currentKind === "operand"
        ? applyOperator(entry.span.start)
        : emptyOperand(entry.span.start));
    }
    output.push(entry);
    previousKind = currentKind;
    previousSpan = entry.span;
    previousOutputIndex = output.length - 1;
  }

  if (previousKind === "operator" && previousSpan) {
    output.splice(previousOutputIndex + 1, 0, emptyOperand(previousSpan.end));
  }

  return Object.freeze({ entries: Object.freeze(output), span });
}

/**
 * Collapse maximal runs of error units separated only by trivia. Trivia between
 * two units moves into the run; trivia before or after it stays at scope level.
 * @param entries - Source entries in order.
 * @returns Entries with each run replaced by one pending error, in order.
 */
function collapseErrors(
  entries: readonly FrameEntry[],
): (CstEntry | PendingError)[] {
  const slots: (CstEntry | PendingError)[] = [];
  let run: PendingError | undefined;
  let held: CstEntry[] = [];
  for (const entry of entries) {
    if (entry.kind === "raw-error") {
      if (run) {
        for (const trivia of held) {
          run.components.push(trivia as CstErrorComponent);
        }
        held = [];
      } else {
        run = { kind: "pending-error", components: [], forcedOperand: false };
        slots.push(run);
      }
      run.components.push(entry.part);
      const source = entry.part.source;
      if (source.kind === "token" && source.errorRole === "operand") {
        run.forcedOperand = true;
      }
    } else if (entry.kind === "trivia" && run) {
      held.push(entry);
    } else {
      for (const trivia of held) slots.push(trivia);
      slots.push(entry);
      run = undefined;
      held = [];
    }
  }
  for (const trivia of held) slots.push(trivia);
  return slots;
}

/**
 * Finalize a collapsed run once its role is known.
 * @param run - Ordered parts and interior trivia.
 * @param errorRole - Fixed DEC-092 operand role or DEC-068 contextual role.
 * @returns Frozen error entry spanning first through last part.
 */
function finishError(run: PendingError, errorRole: CstError["errorRole"]): CstError {
  const first = run.components[0]!;
  const last = run.components[run.components.length - 1]!;
  return Object.freeze({
    kind: "error",
    errorRole,
    components: Object.freeze([...run.components]),
    span: Object.freeze({ start: first.span.start, end: last.span.end }),
  });
}

/**
 * Role of a non-error significant slot.
 * @param slot - Operand, group, or operator slot.
 * @returns Its fixed alternation role.
 */
function fixedKind(slot: CstEntry | PendingError): "operand" | "operator" {
  return slot.kind === "pending-error" ? "operand" : alternationKind(slot);
}

/**
 * Map a classified entry to its role for alternation.
 * @param entry - Non-trivia entry.
 * @returns Operand or operator.
 */
function alternationKind(entry: CstEntry): "operand" | "operator" {
  if (entry.kind === "operator") return "operator";
  if (entry.kind === "error") return entry.errorRole;
  return "operand";
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
 * @returns Explicit operator, source operand, or an uncollapsed error unit.
 */
function sourceEntry(
  source: CoreToken | UnsupportedCoreRegion,
): FrameEntry {
  if (source.kind === "unsupported" ||
    (source.kind === "token" && source.tokenKind === "error")) {
    return rawError("lexer", source);
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
 * @returns An uncollapsed error unit retaining the lexer token.
 */
function unexpectedCloser(token: CoreToken): FrameEntry {
  return rawError("unexpected-closer", token);
}

/**
 * Wrap one original error unit.
 * @param errorKind - Origin of the unit.
 * @param source - Original token or fallback region.
 * @returns Frozen uncollapsed error.
 */
function rawError(
  errorKind: CstErrorPart["errorKind"],
  source: CoreToken | UnsupportedCoreRegion,
): RawError {
  return Object.freeze({
    kind: "raw-error",
    part: Object.freeze({
      kind: "error-part",
      errorKind,
      source,
      span: source.range.bytes,
    }),
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
