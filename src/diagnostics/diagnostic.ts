/**
 * Compile-time diagnostic and success/failure contracts. These types do not
 * validate or freeze values at runtime; locations always refer to original bytes.
 * @module
 */
import type { ByteRange } from "../source/source-input.js";

/** Diagnostic importance; only errors prevent a successful CompilerResult. */
export type DiagnosticSeverity = "error" | "warning" | "info";
/** Caller-selected machine-readable diagnostic identifier. */
export type DiagnosticCode = string;
/** Half-open original-byte location, not a decoded-text offset. */
export type SourceLocation = ByteRange;

/**
 * Shared diagnostic payload, without its severity discriminant.
 * @typeParam Code - Allowed machine-readable codes.
 */
interface DiagnosticBase<Code extends DiagnosticCode = DiagnosticCode> {
  /** Stable code for programmatic classification. */
  readonly code: Code;
  /** Human-readable explanation of the condition. */
  readonly message: string;
  /** Original-byte extent of the condition; may be empty. */
  readonly location: SourceLocation;
}

/**
 * Error-severity diagnostic.
 * @typeParam Code - Allowed error codes.
 */
export type ErrorDiagnostic<Code extends DiagnosticCode = DiagnosticCode> =
  DiagnosticBase<Code> & {
    /** Marks a condition that prevents success. */
    readonly severity: "error";
  };
/**
 * Nonfatal warning diagnostic.
 * @typeParam Code - Allowed warning codes.
 */
export type WarningDiagnostic<Code extends DiagnosticCode = DiagnosticCode> =
  DiagnosticBase<Code> & {
    /** Marks a nonfatal concern. */
    readonly severity: "warning";
  };
/**
 * Informational diagnostic.
 * @typeParam Code - Allowed informational codes.
 */
export type InfoDiagnostic<Code extends DiagnosticCode = DiagnosticCode> =
  DiagnosticBase<Code> & {
    /** Marks a nonfatal informational message. */
    readonly severity: "info";
  };
/**
 * Severity-discriminated diagnostic union.
 * @typeParam Code - Allowed codes across all severities.
 */
export type Diagnostic<Code extends DiagnosticCode = DiagnosticCode> =
  | ErrorDiagnostic<Code>
  | WarningDiagnostic<Code>
  | InfoDiagnostic<Code>;

/** Warning and informational payloads permitted on the success branch. */
type NonErrorDiagnostic = Exclude<Diagnostic, ErrorDiagnostic>;

/**
 * Success carries a value and no errors; failure has no value and begins with
 * an error diagnostic, followed by any diagnostics. Readonly is type-level only.
 * @typeParam T - Successful payload.
 * @typeParam D - Diagnostic union permitted by this operation.
 */
export type CompilerResult<T, D extends Diagnostic = Diagnostic> =
  | {
      /** Selects the successful branch. */
      readonly ok: true;
      /** Payload available only after successful completion. */
      readonly value: T;
      /** Nonfatal diagnostics; the list may be empty. */
      readonly diagnostics: readonly Extract<D, NonErrorDiagnostic>[];
    }
  | {
      /** Selects failure; no successful payload is present. */
      readonly ok: false;
      /** Nonempty diagnostics with an error guaranteed in the first position. */
      readonly diagnostics: readonly [
        Extract<D, ErrorDiagnostic>,
        ...D[],
      ];
    };
