## Plan: Simple Source Parse CLI

Approved 2026-11-07 at 01:16 (+01:00), KP-111. Provide
`npm run parse -- path/to/source` using the existing byte-to-CST parser.
Dump the complete formatted JSON result, including trees, structural trivia,
diagnostics and status, without new dependencies.

**Contract**

- Read source as original bytes, never predecode malformed UTF-8.
- Accept one file path and `--help`; reject invalid invocation explicitly.
- Exit 0 for complete parsing/help; 1 for parse errors while still dumping the
  recovered result; 2 for usage/read failures with an explanatory stderr message.
- Preserve stdout for the result or help; do not truncate deep trees.
- Follow TDD, full JSDoc, review and commit/continue checkpoints per phase.
- No semantic analysis or compiler-language changes.

**Phases**

1. **Phase 1: Arguments and source loading**
   - **Objective:** Testable argument/help handling and byte-preserving file I/O.
   - **Files:** CLI support under `src/cli/`, focused tests, README phase status.
   - **Tests:** Help, missing/extra/unknown arguments, file paths, exact bytes,
     empty input, missing file/directory and explicit read errors.
   - **Steps:** Add importable incomplete contracts, run behavioral assertions
     red, implement minimal complete handling, run green/refactor and type-check,
     review, then stop for commit/continue confirmation.
2. **Phase 2: Parse and complete JSON dump**
   - **Objective:** Integrate `SourceInput`/`parseSource` and JSON stdout output.
   - **Files:** CLI execution/dump implementation and integration tests.
   - **Tests:** Exact JSON result shape, valid/invalid exit statuses, recovered
     trees/diagnostics, malformed bytes, deep groups/long chains and no truncation.
   - **Steps:** Write/run behavioral-red tests, implement stack-safe serialization
     and parser integration, verify green/refactor, review and pause.
3. **Phase 3: Runnable command and documentation**
   - **Objective:** Wire npm/build execution and document actual usage.
   - **Files:** Entry point, package scripts, process tests, README.
   - **Tests:** Spawn actual CLI for help/valid/malformed/unreadable files,
     verify stdout/stderr/exit codes and built command execution.
   - **Steps:** Run failing process tests first, implement executable wiring
     without dependencies or forced early exit/truncated stdout, run focused
     and full tests/type-check/build/export smoke, review and pause.

**Open questions:** None blocking. Additional CLI options and output formats
require separate scope rather than expanding this simple first command.
