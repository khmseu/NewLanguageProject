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
  type DeferredCoreRegion,
  type DeferredSurfaceKind,
  type UnsupportedCoreRegion,
} from "./lexer/core-lexer.js";
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
