import type { ByteRange } from "../source/source-input.js";

export type DiagnosticSeverity = "error" | "warning" | "info";
export type DiagnosticCode = string;
export type SourceLocation = ByteRange;

interface DiagnosticBase<Code extends DiagnosticCode = DiagnosticCode> {
  readonly code: Code;
  readonly message: string;
  readonly location: SourceLocation;
}

export type ErrorDiagnostic<Code extends DiagnosticCode = DiagnosticCode> =
  DiagnosticBase<Code> & { readonly severity: "error" };
export type WarningDiagnostic<Code extends DiagnosticCode = DiagnosticCode> =
  DiagnosticBase<Code> & { readonly severity: "warning" };
export type InfoDiagnostic<Code extends DiagnosticCode = DiagnosticCode> =
  DiagnosticBase<Code> & { readonly severity: "info" };
export type Diagnostic<Code extends DiagnosticCode = DiagnosticCode> =
  | ErrorDiagnostic<Code>
  | WarningDiagnostic<Code>
  | InfoDiagnostic<Code>;

type NonErrorDiagnostic = Exclude<Diagnostic, ErrorDiagnostic>;

export type CompilerResult<T, D extends Diagnostic = Diagnostic> =
  | {
      readonly ok: true;
      readonly value: T;
      readonly diagnostics: readonly Extract<D, NonErrorDiagnostic>[];
    }
  | {
      readonly ok: false;
      readonly diagnostics: readonly [
        Extract<D, ErrorDiagnostic>,
        ...D[],
      ];
    };
