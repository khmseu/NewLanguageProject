import { describe, expect, it } from "vitest";
import type {
  CompilerResult,
  Diagnostic,
  ErrorDiagnostic,
  WarningDiagnostic,
} from "../src/index.js";

describe("diagnostic contracts", () => {
  it("carries a code, severity, and original-byte source location", () => {
    const diagnostic: Diagnostic = {
      code: "LEX001",
      severity: "error",
      message: "Invalid source byte",
      location: { start: 2, end: 3 },
    };

    expect(diagnostic).toMatchObject({
      code: "LEX001",
      severity: "error",
      location: { start: 2, end: 3 },
    });
  });

  it("allows error-free success and requires an error diagnostic on failure", () => {
    const warning: WarningDiagnostic = {
      code: "STYLE001",
      severity: "warning",
      message: "Example warning",
      location: { start: 0, end: 0 },
    };
    const success: CompilerResult<number> = {
      ok: true,
      value: 42,
      diagnostics: [warning],
    };
    const error: ErrorDiagnostic = {
      code: "LEX001",
      severity: "error",
      message: "Invalid source byte",
      location: { start: 0, end: 1 },
    };
    const failure: CompilerResult<number> = {
      ok: false,
      diagnostics: [error] as const,
    };
    const specificError: ErrorDiagnostic<"LEX001"> = {
      code: "LEX001",
      severity: "error",
      message: "Invalid source byte",
      location: { start: 0, end: 1 },
    };
    const specificFailure: CompilerResult<number, ErrorDiagnostic<"LEX001">> = {
      ok: false,
      diagnostics: [specificError] as const,
    };

    expect(success.ok).toBe(true);
    expect(failure.ok).toBe(false);
    expect(specificFailure.ok).toBe(false);

    const impossibleSuccess: CompilerResult<number> = {
      ok: true,
      value: 0,
      // @ts-expect-error A successful result cannot carry an error diagnostic.
      diagnostics: [error],
    };
    // @ts-expect-error A failed result must carry at least one error diagnostic.
    const impossibleFailure: CompilerResult<number> = {
      ok: false,
      diagnostics: [warning],
    };
    const wrongCode: ErrorDiagnostic<"LEX001"> = {
      // @ts-expect-error The error diagnostic code is narrowed to LEX001.
      code: "LEX002",
      severity: "error",
      message: "Invalid source byte",
      location: { start: 0, end: 1 },
    };

    void impossibleSuccess;
    void impossibleFailure;
    void wrongCode;
  });
});
