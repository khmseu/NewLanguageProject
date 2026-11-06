/**
 * Public frontend entry point: byte-preserving input, source translation,
 * pinned Unicode services, diagnostic contracts, and the core lexer.
 * Declaration contracts live in the re-exported modules.
 * @module
 */
export { SourceInput } from "./source/source-input.js";
export type { ByteRange } from "./source/source-input.js";
export {
  processSource,
  type PhysicalPosition,
  type SourceProcessingDiagnostic,
  type SourceProcessingResult,
  type SourceUnit,
  type SourceUnitOrigin,
} from "./source/source-processing.js";
export {
  UNICODE_DATA_VERSION,
  assertUnicodeDataVersion,
  findUnicodeCharacter,
  getUnicodeName,
  getUnicodeNameAliases,
  isXidContinue,
  isXidStart,
} from "./source/unicode-data.js";
export {
  normalizeUnicode18,
  type UnicodeNormalizationForm,
} from "./source/unicode-normalization.js";
export {
  lexCore,
  scanCoreAt,
  type CoreIdentifier,
  type CoreLexResult,
  type CoreLexerDiagnostic,
  type CoreScanStep,
  type CoreToken,
  type CoreTokenKind,
  type CoreTrivia,
  type CoreTriviaKind,
  type UnsupportedCoreRegion,
} from "./lexer/core-lexer.js";
export type { CoreNumber } from "./lexer/numeric-scanner.js";
export type {
  CoreLiteral,
  LiteralDiagnostic,
  LiteralKind,
} from "./lexer/literal-scanner.js";
export type {
  CompilerResult,
  Diagnostic,
  DiagnosticCode,
  DiagnosticSeverity,
  ErrorDiagnostic,
  InfoDiagnostic,
  SourceLocation,
  WarningDiagnostic,
} from "./diagnostics/diagnostic.js";
export {
  type CstApplyOperator,
  type CstDelimiter,
  type CstEmptyOperand,
  type CstEntry,
  type CstError,
  type CstExplicitOperator,
  type CstGroup,
  type CstOperator,
  type CstSequence,
  type CstTokenOperand,
  type CstTriviaEntry,
  type CoreStructureDiagnostic,
  type CoreStructureResult,
  type GroupingDiagnostic,
  type GroupingDiagnosticCode,
} from "./cst/cst.js";
export { structureCore } from "./parser/grouping.js";
