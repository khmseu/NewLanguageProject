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
