## Phase 1 Complete: Arguments and Source Loading

Internal CLI helpers now validate arguments and read original source bytes.
Parser integration and the runnable npm command remain Phases 2 and 3;
this phase does not advertise an executable CLI.

**Files created/changed:**
- [Argument handling](../src/cli/arguments.ts)
- [Source loading](../src/cli/source-file.ts)
- [Tests](../tests/compiler-cli.test.ts)
- [README](../README.md), approved CLI plan and both context records.

**Functions/contracts:**
- `parseCliArguments`, `CliArgumentResult`, `CLI_USAGE`: help, file selection
  and explicit usage errors with exit code 2, without writing streams or exiting.
- `readSourceFile`, `SourceFileResult`: original bytes or contextual filesystem
  errors with exit code 2. Unexpected/programming exceptions propagate.
- `--help` is standalone. Exactly one path is allowed; `--` permits a
  leading-hyphen path, including a literal `--help` filename. Empty paths and
  unknown/extra arguments are rejected. No short-help alias added.
- Help/usage messages are data for the future entry point; no new dependencies.

**TDD evidence:**
- Implementer reported 17 of 18 behavioral failures against importable
  skeletons, then green. A later unknown-option-plus-extra-argument assertion
  failed before refining validation order and then passed.
- Tests cover malformed UTF-8/BOM bytes, empty files, Unicode/spaced paths,
  missing files, directories and propagation of programming errors.
- Temporary test directories are created inside the project and cleaned.

**Review status:** APPROVED by read-only static review, with no findings.
Reviewer did not execute checks.

**Validation:**
- Conductor: focused suite **18 passed**, type-check, build/public export smoke
  and whitespace check pass.
- Implementer additionally reported full suite **559 passed** (11 files) and
  built CLI-module import/read smoke. Full count was not independently rerun.
- No package commands or public library exports changed.

**Next checkpoint:** Await commit/continue confirmation. Phase 2 will integrate
the parser and full formatted JSON dump, including error status and deep input.

**Git commit message:**

```text
feat(cli): validate arguments and load source bytes

Add testable help, single-path validation and explicit usage errors.
Load source files without decoding and report contextual filesystem
failures while propagating unexpected exceptions.

Add test-first argument and raw-byte loading coverage and document
the internal-only CLI status before parser and command integration.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
