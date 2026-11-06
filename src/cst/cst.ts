/**
 * Lossless structural CST contracts for delimiter grouping and implicit
 * operand/operator insertion. This is intentionally not a precedence tree.
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
  | "unexpected-closing-delimiter"
  | "missing-closing-delimiter";

/**
 * A delimiter-specific recovery error located in original bytes.
 * @typeParam Code - One of the grouping recovery codes.
 */
export type GroupingDiagnostic<Code extends GroupingDiagnosticCode = GroupingDiagnosticCode> =
  ErrorDiagnostic<Code> & {
    /** Expected closing delimiter, present only for a missing closer. */
    readonly expected?: string;
    /** Unexpected source delimiter, present only for an unexpected closer. */
    readonly actual?: string;
  };

/** Diagnostics preserved from lexing, plus structural delimiter diagnostics. */
export type CoreStructureDiagnostic =
  | CoreLexerDiagnostic
  | GroupingDiagnostic;

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
  | CstExplicitOperator
  | CstApplyOperator;

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

/** A lexical or unexpected-closer error retained without contextual role selection. */
export interface CstError {
  /** Identifies an error entry, which remains a distinct item in this phase. */
  readonly kind: "error";
  /** Distinguishes preserved lexer errors from mismatched source closers. */
  readonly errorKind: "lexer" | "unexpected-closer";
  /**
   * Known lexical operand role or unresolved contextual role. Phase 8 handles
   * only the latter; this phase does not infer a role for fallback errors.
   */
  readonly errorRole: "operand" | "unresolved";
  /** Original lexer token or fallback region, never collapsed with neighbors. */
  readonly source: CoreToken | UnsupportedCoreRegion;
  /** Original-byte error span. */
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
 * Structural grouping output. Diagnostics are retained as data; this API does
 * not claim parse success or make a contextual error classification.
 */
export interface CoreStructureResult {
  /** Root file sequence, retaining source entries and implicit elements. */
  readonly root: CstSequence;
  /** Original lexer diagnostics plus structural delimiter recovery diagnostics. */
  readonly diagnostics: readonly CoreStructureDiagnostic[];
}
