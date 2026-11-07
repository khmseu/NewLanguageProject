/**
 * Small, importable argument and help support for the internal compiler CLI.
 */

/** Usage synopsis for the source-parse command. */
export const CLI_USAGE = "Usage: parse [--help] [--] <source-file>";

/**
 * Result of interpreting one CLI argument vector.
 *
 * A usage error carries the process-style status code 2 but does not write to
 * stderr; the command entry point owns stream output.
 */
export type CliArgumentResult =
  | {
      /** Help was requested without any additional arguments. */
      readonly kind: "help";
      /** Help text intended for stdout. */
      readonly message: string;
      /** Successful process-style status for help. */
      readonly exitCode: 0;
    }
  | {
      /** Exactly one source path was selected. */
      readonly kind: "file";
      /** Path spelling as supplied by the caller; it is not normalized. */
      readonly path: string;
    }
  | {
      /** Arguments did not match the supported invocation. */
      readonly kind: "usage-error";
      /** Explanation intended for stderr. */
      readonly message: string;
      /** Usage-failure process status; this function does not exit. */
      readonly exitCode: 2;
    };

/**
 * Parses CLI arguments without reading files or writing to process streams.
 *
 * @param args Arguments after the executable and command names.
 * @returns A help request, one source path, or a usage error.
 * @throws This function does not throw for malformed argument vectors.
 */
export function parseCliArguments(args: readonly string[]): CliArgumentResult {
  if (args.length === 1 && args[0] === "--help") {
    return {
      kind: "help",
      message: [
        CLI_USAGE,
        "",
        "Parse one source file and print the compiler result.",
        "",
        "Options:",
        "  --help  Show this help message.",
        "  --      End option parsing; use it for a path beginning with '-'.",
      ].join("\n"),
      exitCode: 0,
    };
  }

  if (args.length === 0) {
    return usageError("Missing source file.");
  }

  const firstArgument = args[0];
  if (firstArgument === "--") {
    if (args.length !== 2) {
      return usageError(
        args.length < 2
          ? "Expected one source file after '--'."
          : "Expected exactly one source file after '--'.",
      );
    }
    const path = args[1];
    if (path === undefined || path === "") {
      return usageError("The source path must not be empty.");
    }
    return { kind: "file", path };
  }

  if (firstArgument === undefined) {
    return usageError("Missing source file.");
  }

  if (firstArgument === "--help") {
    return usageError("'--help' must be used alone.");
  }
  if (firstArgument.startsWith("-")) {
    return usageError(
      `Unknown option '${firstArgument}'. Use '--' before a path beginning with '-'.`,
    );
  }
  if (args.length > 1) {
    return usageError("Expected exactly one source file; received extra arguments.");
  }
  if (firstArgument === "") {
    return usageError("The source path must not be empty.");
  }

  return { kind: "file", path: firstArgument };
}

/**
 * Adds the usage synopsis to a concise argument validation explanation.
 *
 * @param reason Argument-specific explanation.
 * @returns A multiline message for stderr.
 * @throws This helper does not throw for string input.
 */
function usageError(reason: string): CliArgumentResult {
  return {
    kind: "usage-error",
    message: `${reason}\n${CLI_USAGE}`,
    exitCode: 2,
  };
}
