## Plan Complete: Simple Source Parse CLI

All three approved implementation phases are complete. A source file can now
be parsed into a complete formatted JSON dump of the existing frontend result.
Errors retain recovered trees and diagnostics with a nonzero process status.

**Phases Completed: 3 of 3**

1. [Arguments and source loading](compiler-cli-phase-1-complete.md)
2. [Parser integration and complete JSON](compiler-cli-phase-2-complete.md)
3. [Runnable command and process tests](compiler-cli-phase-3-complete.md)

**Usage:**

- `npm run parse -- path/to/source`
- `npm run parse -- --help`
- `npm --silent run parse -- path/to/source` for JSON piping without npm banners.
- `node dist/cli/main.js path/to/source` after building.

**Files created/modified:**

- [Arguments](../src/cli/arguments.ts), [byte loading](../src/cli/source-file.ts),
  [execution/serialization](../src/cli/execute.ts),
  [entry](../src/cli/main.ts), [stream writing](../src/cli/stream-writer.ts).
- [Argument/file tests](../tests/compiler-cli.test.ts),
  [execution tests](../tests/compiler-cli-execution.test.ts),
  [process tests](../tests/compiler-cli-process.test.ts).
- [Package command](../package.json), [README](../README.md),
  [current knowledge](../Kontext/Wissensstand.md),
  [history](../Kontext/Kontextprotokoll.md), [plan](compiler-cli-plan.md),
  all phase records above and this report.

**Key behavior:**

- Read raw bytes; reuse `SourceInput` and `parseSource`, without language changes.
- Preserve full result/trivia/diagnostics in stack-safe two-space JSON.
- Await ordered chunk writes and process stream backpressure.
- Exit 0 complete/help, 1 recovered parse errors, 2 usage/read failures.
- Help/results on stdout, operational usage/read messages on stderr.
- Output is not truncated; inherent depth/reference expansion and available
  memory/time/destination capacity remain practical limits.
- No new dependencies, semantic analysis, AST, runtime or backend.

**Verification:** 591 tests in 13 files pass in the independently executed
serial full suite. CLI coverage totals 50 runner tests (18 + 16 + 16).
Type-check, build/export smoke and whitespace checks pass. Phase records
distinguish static reviews, reported red evidence and conductor execution.
Final runtime validation was Linux/Node26, not Windows/Node24 certification.

**Commit status:** Phase 1 `3125545`; Phase 2 `ab821e5`. Final phase and these
records are uncommitted; await explicit authorization before committing.
Further options/formats or compiler work require separately agreed scope.
