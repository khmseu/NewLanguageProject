/**
 * Lossless structural CST contracts for delimiter grouping and implicit
 * operand/operator insertion. This is intentionally not a precedence tree.
 * Errors are collapsed and role-classified under DEC-092 and DEC-068.
 * @module
 */
import type { ErrorDiagnostic } from "../diagnostics/diagnostic.js";
import type {
  CoreLexerDiagnostic,
  CoreToken,
  CoreTrivia,
  UnsupportedCoreRegion,
} from "../lexer/core-lexer.js";
import type { ByteRange } from "../source/source-input.js";

/** Diagnostic codes added while matching or inserting delimiter closers. */
export type GroupingDiagnosticCode =
  "unexpected-closing-delimiter" | "missing-closing-delimiter";

/**
 * A delimiter-specific recovery error located in original bytes.
 * @typeParam Code - One of the grouping recovery codes.
 */
export type GroupingDiagnostic<
  Code extends GroupingDiagnosticCode = GroupingDiagnosticCode,
> = ErrorDiagnostic<Code> & {
  /** Expected closing delimiter, present only for a missing closer. */
  readonly expected?: string;
  /** Unexpected source delimiter, present only for an unexpected closer. */
  readonly actual?: string;
};

/** Diagnostics preserved from lexing, plus structural delimiter diagnostics. */
export type CoreStructureDiagnostic = CoreLexerDiagnostic | GroupingDiagnostic;

/** An ordered, shallow sequence at file or group scope; not precedence-parsed. */
export interface CstSequence {
  /** Ordered source entries, with trivia retained and implicit entries inserted. */
  readonly entries: readonly CstEntry[];
  /** Original-byte extent of the file or the region inside one delimiter pair. */
  readonly span: ByteRange;
}

/** One source-preserving item in a structural sequence. */
export type CstEntry =
  | CstTokenOperand
  | CstEmptyOperand
  | CstGroup
  | CstOperator
  | CstTriviaEntry
  | CstError;

/** A source token that is provisionally an operand at this parser phase. */
export interface CstTokenOperand {
  /** Identifies an operand entry backed by one recognized lexer token. */
  readonly kind: "operand";
  /** Distinguishes source operands from an inserted EMPTY operand. */
  readonly operandKind: "token";
  /** Original lexer token, preserving translated spelling and byte provenance. */
  readonly token: CoreToken;
  /** Original-byte token span. */
  readonly span: ByteRange;
}

/** An inserted `EMPTY` operand with no invented source bytes. */
export interface CstEmptyOperand {
  /** Identifies an operand entry. */
  readonly kind: "operand";
  /** Marks this node as the implicit empty operand. */
  readonly operandKind: "empty";
  /** Stable display spelling for structural inspection. */
  readonly spelling: "EMPTY";
  /** Zero-width original-byte anchor selected by the documented rule. */
  readonly span: ByteRange;
  /** Always true; this node has no corresponding source token. */
  readonly synthetic: true;
}

/** An explicit source operator or inserted `APPLY` operator. */
export type CstOperator =
  CstExplicitOperator | CstApplyOperator | CstErrorOperator;

/**
 * An operator-classified collapsed error as a binary operator (DEC-086). It
 * binds tighter than every source operator and is left-associative.
 */
export interface CstErrorOperator {
  /** Identifies an operator entry. */
  readonly kind: "operator";
  /** Marks an error acting as an operator in a parsed tree. */
  readonly operatorKind: "error";
  /** The original collapsed error with its operator role. */
  readonly error: CstError & { readonly errorRole: "operator" };
  /** Original-byte error span. */
  readonly span: ByteRange;
  /** Always false: the bytes are source bytes, not an insertion. */
  readonly synthetic: false;
}

/** An operator token retained from the lexer. */
export interface CstExplicitOperator {
  /** Identifies an operator entry. */
  readonly kind: "operator";
  /** Marks this as an explicit token, not an insertion. */
  readonly operatorKind: "explicit";
  /** Original lexer operator token. */
  readonly token: CoreToken;
  /** Original-byte token span. */
  readonly span: ByteRange;
  /** Always false for source operators. */
  readonly synthetic: false;
}

/** An inserted `APPLY` operator with no corresponding source bytes. */
export interface CstApplyOperator {
  /** Identifies an operator entry. */
  readonly kind: "operator";
  /** Marks this as implicit application. */
  readonly operatorKind: "apply";
  /** Stable display spelling for structural inspection. */
  readonly spelling: "APPLY";
  /** Zero-width original-byte anchor selected by the documented rule. */
  readonly span: ByteRange;
  /** Always true; this node has no corresponding source token. */
  readonly synthetic: true;
}

/** Preserved whitespace, comment, or BOM item. */
export interface CstTriviaEntry {
  /** Identifies preserved trivia. */
  readonly kind: "trivia";
  /** Original lexer item, including its original-byte span. */
  readonly source: CoreTrivia;
  /** Original-byte trivia span. */
  readonly span: ByteRange;
}

/**
 * One original lexical or unexpected-closer error unit. Parts are never merged
 * with each other; a {@link CstError} owns an ordered run of them.
 */
export interface CstErrorPart {
  /** Identifies one original error unit inside a collapsed error. */
  readonly kind: "error-part";
  /** Distinguishes preserved lexer errors from mismatched source closers. */
  readonly errorKind: "lexer" | "unexpected-closer";
  /** Original lexer token or fallback region, with its own diagnostics. */
  readonly source: CoreToken | UnsupportedCoreRegion;
  /** Original-byte span of this part alone. */
  readonly span: ByteRange;
}

/** An original item owned by a collapsed error: an error part or trivia between parts. */
export type CstErrorComponent = CstErrorPart | CstTriviaEntry;

/**
 * A maximal run of consecutive error units (DEC-079/087), collapsed across
 * whitespace and comments. DEC-092 fixes runs containing a lexically
 * designated operand error as operands; DEC-068 contextually classifies other
 * runs. The trivia between parts is owned by the error so byte order stays
 * lossless.
 */
export interface CstError {
  /** Identifies an error entry. */
  readonly kind: "error";
  /**
   * Operand or operator role: DEC-092 fixes a run containing a lexically
   * designated operand error as an operand; otherwise DEC-068 selects the role
   * requiring fewer `APPLY`/`EMPTY` insertions, preferring operand on a tie.
   */
  readonly errorRole: "operand" | "operator";
  /** Ordered original parts and interior trivia; first and last are parts. */
  readonly components: readonly CstErrorComponent[];
  /** Original-byte span from the first part's start through the last part's end. */
  readonly span: ByteRange;
}

/** An opening delimiter and its recursively grouped interior as one operand. */
export interface CstGroup {
  /** Identifies a complete or EOF-recovered group operand. */
  readonly kind: "group";
  /** The original source opener. */
  readonly open: CoreToken;
  /** Independent, shallow operator/operand sequence inside the delimiters. */
  readonly contents: CstSequence;
  /** Source closer or zero-width EOF insertion. */
  readonly close: CstDelimiter;
  /** Original-byte extent from source opener through source/inserted closer. */
  readonly span: ByteRange;
}

/** A source delimiter token or a synthetic expected closer. */
export interface CstDelimiter {
  /** Delimiter spelling, including the expected spelling for inserted closers. */
  readonly spelling: string;
  /** Original source token; absent only for a synthetic EOF insertion. */
  readonly token?: CoreToken;
  /** Source span or zero-width insertion anchor. */
  readonly span: ByteRange;
  /** True only when the closer was inserted at EOF. */
  readonly synthetic: boolean;
}

/**
 * Structural grouping output with DEC-092-constrained error roles, DEC-068
 * contextual classification for other runs, and minimal `APPLY`/`EMPTY`
 * insertions subject to those roles. Diagnostics are retained as data; this
 * API does not claim parse success.
 */
export interface CoreStructureResult {
  /** Root file sequence, retaining source entries and implicit elements. */
  readonly root: CstSequence;
  /** Original lexer diagnostics plus structural delimiter recovery diagnostics. */
  readonly diagnostics: readonly CoreStructureDiagnostic[];
}

/**
 * An operator and its two syntactic arguments. The node records binding only;
 * it does not assign operator meaning or validate argument legality.
 */
export interface CstBinaryExpression {
  /** Identifies a precedence-reduced binary node. */
  readonly kind: "binary";
  /** Left child, which may itself be a binary expression or grouped operand. */
  readonly left: CstExpression;
  /** Original or inserted operator, preserving token provenance. */
  readonly operator: CstOperator;
  /** Right child, which may itself be a binary expression or grouped operand. */
  readonly right: CstExpression;
  /** Original-byte extent from the left child through the right child. */
  readonly span: ByteRange;
}

/**
 * A delimiter group in a parsed tree, with its interior parsed independently.
 * The structural sequence remains available even when its expression is absent.
 */
export interface CstParsedGroup {
  /** Identifies a parenthesized, bracketed or braced operand. */
  readonly kind: "group-expression";
  /** Original opener token. */
  readonly open: CoreToken;
  /** Source closer or zero-width expected closer inserted at EOF. */
  readonly close: CstDelimiter;
  /** Parsed interior; an absent expression preserves malformed structure. */
  readonly contents: CstParsedSequence;
  /** Original-byte extent from opener through source/inserted closer. */
  readonly span: ByteRange;
}

/** A collapsed error whose selected role is operand, acting as an ordinary leaf. */
export interface CstErrorOperand {
  /** Identifies a preserved lexical-error operand. */
  readonly kind: "error-operand";
  /** Original error entry, including its lexer token or fallback region. */
  readonly error: CstError & { readonly errorRole: "operand" };
  /** Original-byte error extent. */
  readonly span: ByteRange;
}

/** Expression leaves and binary reductions produced by the parser. */
export type CstExpression =
  | CstTokenOperand
  | CstEmptyOperand
  | CstErrorOperand
  | CstParsedGroup
  | CstBinaryExpression;

/**
 * One precedence-parsed file or group scope plus its lossless structural form.
 * After recovery every scope alternates operands and operators, so `expression`
 * is only undefined if an unknown operator precedence is reported.
 */
export interface CstParsedSequence {
  /** Original structural entries, including all trivia and explicit errors. */
  readonly structure: CstSequence;
  /** Binary expression tree; undefined only after an internal precedence diagnostic. */
  readonly expression: CstExpression | undefined;
  /** Original-byte extent of this scope. */
  readonly span: ByteRange;
}

/** Diagnostic codes produced by precedence parsing. */
export type PrecedenceDiagnosticCode =
  | "non-associative-operator-chain"
  | "unknown-operator-precedence"
  | "invalid-operator-sequence";

/**
 * A syntax-level precedence diagnostic, located in original source bytes.
 * The parser retains its deterministic partial tree when possible.
 */
export type PrecedenceDiagnostic<
  Code extends PrecedenceDiagnosticCode = PrecedenceDiagnosticCode,
> = ErrorDiagnostic<Code> & {
  /** Source spelling of the operator relevant to this diagnostic. */
  readonly operator?: string;
};

/** Precedence parser diagnostics, including all lexer and grouping errors. */
export type CstParseDiagnostic = CoreStructureDiagnostic | PrecedenceDiagnostic;

/**
 * Precedence parse output. `status: "error"` is used whenever an error
 * diagnostic exists; trees and structural partial output remain available.
 */
export interface CstParseResult {
  /** Parsed root scope with its full lossless structural sequence. */
  readonly root: CstParsedSequence;
  /** Lexer, grouping, and precedence diagnostics in byte order. */
  readonly diagnostics: readonly CstParseDiagnostic[];
  /** Error-bearing parses are never marked complete. */
  readonly status: "complete" | "error";
}
