/**
 * Public precedence-parser entry points, operator binding table, and tree
 * construction. The parser does not perform keyword- or construct-specific
 * grammar or semantic legality checks. Error collapse and role selection happen
 * in structural grouping, so each scope arrives strictly alternating.
 * @module
 */
import type {
  CstBinaryExpression,
  CstError,
  CstErrorOperand,
  CstExpression,
  CstGroup,
  CstOperator,
  CstParseDiagnostic,
  CstParseResult,
  CstParsedGroup,
  CstParsedSequence,
  CstSequence,
  PrecedenceDiagnostic,
  PrecedenceDiagnosticCode,
} from "../cst/cst.js";
import type { ByteRange } from "../source/source-input.js";
import type { CoreLexResult } from "../lexer/core-lexer.js";
import { lexCore } from "../lexer/core-lexer.js";
import type { SourceInput } from "../source/source-input.js";
import { structureCore } from "./grouping.js";

/** Associativity shared by every operator at one relative precedence level. */
export type OperatorAssociativity = "left" | "right" | "non-associative";

/** Relative operator binding; smaller priorities bind more tightly. */
export interface OperatorPrecedence {
  /** Integer order from tightest (zero) to loosest. */
  readonly priority: number;
  /** Rule used when another operator at this priority is encountered. */
  readonly associativity: OperatorAssociativity;
}

/**
 * Approved DEC-022/066/093 precedence table, tightest first. `APPLY` denotes
 * the implicit operator inserted by structural grouping, not a source spelling.
 */
export const OPERATOR_PRECEDENCE = Object.freeze({
  "@": binding(0, "non-associative"),
  ".": binding(1, "left"),
  "->": binding(2, "non-associative"),
  APPLY: binding(3, "left"),
  "++": binding(4, "non-associative"),
  "--": binding(4, "non-associative"),
  "!": binding(4, "non-associative"),
  "~": binding(4, "non-associative"),
  "**": binding(5, "right"),
  "*": binding(6, "left"),
  "/": binding(6, "left"),
  "%": binding(6, "left"),
  "+": binding(7, "left"),
  "-": binding(7, "left"),
  "<<": binding(8, "left"),
  ">>": binding(8, "left"),
  "&": binding(9, "left"),
  "^": binding(10, "left"),
  "|": binding(11, "left"),
  "<": binding(12, "left"),
  "<=": binding(12, "left"),
  ">": binding(12, "left"),
  ">=": binding(12, "left"),
  "==": binding(13, "left"),
  "!=": binding(13, "left"),
  "&&": binding(14, "left"),
  "||": binding(15, "left"),
  "<-": binding(16, "non-associative"),
  "?": binding(17, "right"),
  ":": binding(18, "right"),
  "::": binding(18, "right"),
  "=": binding(19, "right"),
  ":=": binding(19, "right"),
  "::=": binding(19, "right"),
  "+=": binding(19, "right"),
  "-=": binding(19, "right"),
  "*=": binding(19, "right"),
  "/=": binding(19, "right"),
  "%=": binding(19, "right"),
  "&=": binding(19, "right"),
  "|=": binding(19, "right"),
  "^=": binding(19, "right"),
  "<<=": binding(19, "right"),
  ">>=": binding(19, "right"),
  ",": binding(20, "left"),
  ";": binding(21, "left"),
} satisfies Readonly<Record<string, OperatorPrecedence>>);

/**
 * DEC-086 binding of an operator-classified error: tighter than `@` (priority
 * zero) and left-associative.
 */
export const ERROR_OPERATOR_PRECEDENCE: OperatorPrecedence = binding(
  -1,
  "left",
);

/** An operator waiting to be reduced from the explicit operator stack. */
interface PendingOperator {
  /** Original or implicit operator token retained in the tree. */
  readonly operator: CstOperator;
  /** Approved binding for its spelling. */
  readonly precedence: OperatorPrecedence;
}

/** A post-order traversal frame for one delimiter scope. */
interface SequenceFrame {
  /** Structural source sequence to parse. */
  readonly sequence: CstSequence;
  /** Whether nested groups have already been visited. */
  readonly expanded: boolean;
}

/**
 * Parse an existing lossless lexer result into a precedence-based binary CST.
 * @param lexed - Token/trivia stream with original-byte provenance.
 * @returns A tree or explicit structural partial output plus all diagnostics.
 * @throws {Error} If an internal group post-order invariant is violated.
 */
export function parseCore(lexed: CoreLexResult): CstParseResult {
  const grouped = structureCore(lexed);
  const diagnostics: CstParseDiagnostic[] = [...grouped.diagnostics];
  const parsedSequences = new WeakMap<CstSequence, CstParsedSequence>();
  const parsedGroups = new WeakMap<CstGroup, CstParsedGroup>();
  const pending: SequenceFrame[] = [
    { sequence: grouped.root, expanded: false },
  ];

  // An explicit post-order stack keeps deeply nested delimiter input from
  // consuming the JavaScript call stack while preserving independent scopes.
  while (pending.length > 0) {
    const frame = pending.pop()!;
    if (!frame.expanded) {
      pending.push({ sequence: frame.sequence, expanded: true });
      for (let index = frame.sequence.entries.length - 1; index >= 0; index--) {
        const entry = frame.sequence.entries[index]!;
        if (entry.kind === "group") {
          pending.push({ sequence: entry.contents, expanded: false });
        }
      }
      continue;
    }

    for (const entry of frame.sequence.entries) {
      if (entry.kind !== "group") continue;
      const contents = parsedSequences.get(entry.contents);
      if (!contents) {
        throw new Error("Group contents were not parsed before their parent.");
      }
      parsedGroups.set(
        entry,
        Object.freeze({
          kind: "group-expression",
          open: entry.open,
          close: entry.close,
          contents,
          span: entry.span,
        }),
      );
    }

    const expression = parseSequenceExpression(
      frame.sequence,
      parsedGroups,
      diagnostics,
    );
    parsedSequences.set(
      frame.sequence,
      Object.freeze({
        structure: frame.sequence,
        expression,
        span: frame.sequence.span,
      }),
    );
  }

  const root = parsedSequences.get(grouped.root);
  if (!root) throw new Error("Root sequence was not parsed.");
  diagnostics.sort(
    (left, right) =>
      left.location.start - right.location.start ||
      left.location.end - right.location.end,
  );
  const frozenDiagnostics = Object.freeze(diagnostics);
  return Object.freeze({
    root,
    diagnostics: frozenDiagnostics,
    status: frozenDiagnostics.some(
      (diagnostic) => diagnostic.severity === "error",
    )
      ? "error"
      : "complete",
  });
}

/**
 * Run the core lexer and precedence parser for byte-preserving source input.
 * @param input - Original UTF-8 bytes captured by `SourceInput`.
 * @returns Parsed CST, or explicit partial output with error status/diagnostics.
 * @throws {Error} If the pinned source/Unicode processing contract cannot run.
 */
export function parseSource(input: SourceInput): CstParseResult {
  return parseCore(lexCore(input));
}

/**
 * Describe one table entry. The returned object is frozen so the exported
 * precedence table cannot be changed through its nested values.
 * @param priority - Relative level, with smaller values binding more tightly.
 * @param associativity - Same-level binding rule.
 * @returns Immutable operator binding.
 */
function binding(
  priority: number,
  associativity: OperatorAssociativity,
): OperatorPrecedence {
  return Object.freeze({ priority, associativity });
}

/**
 * Reduce one shallow structural scope. Operand-role errors are leaves and
 * operator-role errors are tightest left-associative operators. A malformed
 * alternation (not produced by recovery) leaves the tree unavailable.
 * @param sequence - Grouped entries for one file or delimiter scope.
 * @param parsedGroups - Post-order parsed group wrappers.
 * @param diagnostics - Shared parser diagnostic accumulator.
 * @returns Binary expression or undefined for explicit partial output.
 * @throws {Error} If a nested group is missing from the completed post-order map.
 */
function parseSequenceExpression(
  sequence: CstSequence,
  parsedGroups: WeakMap<CstGroup, CstParsedGroup>,
  diagnostics: CstParseDiagnostic[],
): CstExpression | undefined {
  const operands: CstExpression[] = [];
  const operators: CstOperator[] = [];
  let expectsOperand = true;

  for (const entry of sequence.entries) {
    if (entry.kind === "trivia") continue;
    if (entry.kind === "error" && entry.errorRole === "operand") {
      const operand: CstErrorOperand = Object.freeze({
        kind: "error-operand",
        error: entry as CstError & { readonly errorRole: "operand" },
        span: entry.span,
      });
      if (!expectsOperand) {
        diagnostics.push(invalidSequence(entry.span));
        return undefined;
      }
      operands.push(operand);
      expectsOperand = false;
      continue;
    }
    if (entry.kind === "operator" || entry.kind === "error") {
      if (expectsOperand) {
        diagnostics.push(invalidSequence(entry.span));
        return undefined;
      }
      operators.push(
        entry.kind === "error"
          ? Object.freeze({
              kind: "operator",
              operatorKind: "error",
              error: entry as CstError & { readonly errorRole: "operator" },
              span: entry.span,
              synthetic: false,
            } as const)
          : entry,
      );
      expectsOperand = true;
      continue;
    }

    let operand: CstExpression;
    if (entry.kind === "group") {
      const group = parsedGroups.get(entry);
      if (!group) throw new Error("Nested group was not parsed.");
      operand = group;
    } else {
      operand = entry;
    }
    if (!expectsOperand) {
      diagnostics.push(invalidSequence(entry.span));
      return undefined;
    }
    operands.push(operand);
    expectsOperand = false;
  }

  if (
    operands.length === 0 ||
    expectsOperand ||
    operands.length !== operators.length + 1
  ) {
    const span = sequence.entries.at(-1)?.span ?? sequence.span;
    diagnostics.push(invalidSequence(span));
    return undefined;
  }

  return reduceOperators(operands, operators, diagnostics);
}

/**
 * Apply the shunting-yard reduction rule using an explicit operator stack.
 * Lower priority numbers bind more tightly. Equal-level left/non-associative
 * operators reduce immediately; right-associative operators remain stacked.
 * @param operands - Alternating expression leaves/group nodes in source order.
 * @param operators - Alternating explicit and implicit operators in source order.
 * @param diagnostics - Parser diagnostic accumulator.
 * @returns The single resulting binary tree, or undefined on an unknown operator.
 */
function reduceOperators(
  operands: readonly CstExpression[],
  operators: readonly CstOperator[],
  diagnostics: CstParseDiagnostic[],
): CstExpression | undefined {
  const valueStack: CstExpression[] = [operands[0]!];
  const operatorStack: PendingOperator[] = [];
  const nonAssociativeSeen = new Map<number, string>();

  for (let index = 0; index < operators.length; index++) {
    const operator = operators[index]!;
    const spelling = operatorSpelling(operator);
    const precedence =
      operator.operatorKind === "error"
        ? ERROR_OPERATOR_PRECEDENCE
        : precedenceFor(spelling);
    if (!precedence) {
      diagnostics.push(
        precedenceDiagnostic(
          "unknown-operator-precedence",
          `No precedence is defined for operator ${spelling}.`,
          operator.span,
          spelling,
        ),
      );
      return undefined;
    }

    for (const priority of nonAssociativeSeen.keys()) {
      if (priority < precedence.priority) nonAssociativeSeen.delete(priority);
    }
    if (precedence.associativity === "non-associative") {
      if (nonAssociativeSeen.has(precedence.priority)) {
        diagnostics.push(
          precedenceDiagnostic(
            "non-associative-operator-chain",
            `Operator ${spelling} is chained at a non-associative precedence level.`,
            operator.span,
            spelling,
          ),
        );
      }
      nonAssociativeSeen.set(precedence.priority, spelling);
    }

    while (
      operatorStack.length > 0 &&
      shouldReduce(operatorStack[operatorStack.length - 1]!, precedence)
    ) {
      reduceTop(valueStack, operatorStack);
    }
    operatorStack.push({ operator, precedence });
    valueStack.push(operands[index + 1]!);
  }

  while (operatorStack.length > 0) reduceTop(valueStack, operatorStack);
  return valueStack[0];
}

/**
 * Decide whether a pending operator binds before the incoming operator.
 * @param pending - Top of the operator stack.
 * @param incoming - Binding of the current source operator.
 * @returns True when the pending operator must be reduced now.
 */
function shouldReduce(
  pending: PendingOperator,
  incoming: OperatorPrecedence,
): boolean {
  if (pending.precedence.priority < incoming.priority) return true;
  if (pending.precedence.priority > incoming.priority) return false;
  return incoming.associativity !== "right";
}

/**
 * Reduce one binary operation and retain all source/operator provenance.
 * @param values - Expression stack, updated in place.
 * @param operators - Pending operator stack, updated in place.
 * @returns No value; the reduced binary node is pushed onto `values`.
 */
function reduceTop(
  values: CstExpression[],
  operators: PendingOperator[],
): void {
  const pending = operators.pop()!;
  const right = values.pop()!;
  const left = values.pop()!;
  const node: CstBinaryExpression = Object.freeze({
    kind: "binary",
    left,
    operator: pending.operator,
    right,
    span: Object.freeze({ start: left.span.start, end: right.span.end }),
  });
  values.push(node);
}

/**
 * Return the approved precedence for a source or inserted operator spelling.
 * @param spelling - Source spelling or the structural `APPLY` name.
 * @returns Binding entry, or undefined if the operator is not in the approved
 * DEC-022/093 table.
 */
function precedenceFor(spelling: string): OperatorPrecedence | undefined {
  return (OPERATOR_PRECEDENCE as Readonly<Record<string, OperatorPrecedence>>)[
    spelling
  ];
}

/**
 * Read the stable spelling from either operator variant.
 * @param operator - Explicit token or inserted APPLY node.
 * @returns Operator spelling used by the precedence table and diagnostics.
 */
function operatorSpelling(operator: CstOperator): string {
  if (operator.operatorKind === "apply") return operator.spelling;
  if (operator.operatorKind === "error") return "ERROR";
  return operator.token.spelling;
}

/**
 * Create the error diagnostic for a malformed structural alternation.
 * @param location - Original-byte span of the unexpected entry.
 * @returns Error diagnostic explaining why no tree was produced.
 */
function invalidSequence(location: ByteRange): PrecedenceDiagnostic {
  return Object.freeze({
    code: "invalid-operator-sequence",
    severity: "error",
    message:
      "Expected alternating operands and operators in this source scope.",
    location,
  });
}

/**
 * Construct a precedence diagnostic while retaining its source location.
 * @param code - Machine-readable parser diagnostic code.
 * @param message - Human-readable explanation.
 * @param location - Original-byte operator span.
 * @param operator - Optional operator spelling for tools.
 * @returns Frozen typed diagnostic.
 */
function precedenceDiagnostic(
  code: PrecedenceDiagnosticCode,
  message: string,
  location: ByteRange,
  operator?: string,
): PrecedenceDiagnostic {
  return Object.freeze({
    code,
    severity: "error",
    message,
    location,
    ...(operator === undefined ? {} : { operator }),
  });
}
