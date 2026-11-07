## Phase 2 Complete: Parse and Complete JSON Dump

Importable CLI execution now reads source bytes, parses them and writes the
complete formatted JSON result. Actual process/npm command wiring remains
Phase 3; no runnable command is advertised yet.

**Files created/changed:**

- [Execution and serializer](../src/cli/execute.ts)
- [Integration tests](../tests/compiler-cli-execution.test.ts)
- [README](../README.md), context records and phase completion records.

**Functions/contracts:**

- `executeCli(args, streams)` returns 0 for help/complete parse, 1 for recovered
  parsing with errors, 2 for usage/read failures. It does not force process exit.
- Help/results go to stdout; usage/read errors go to stderr. Unexpected parser
  and writer failures propagate.
- `writeParseResult(result, write)` iteratively traverses the plain result,
  emitting two-space JSON plus a final newline in buffered chunks. Every write
  is awaited, preserving ordering and allowing destination backpressure.
- Tree, structure/trivia, diagnostics and status are all retained. Undefined
  object fields are omitted; array undefined entries become null. Native
  scalar JSON escaping is retained. Shared references serialize at each use.
- Pretty indentation inherently increases output size quadratically with depth;
  repeated nested structure can multiply size. No arbitrary truncation imposed,
  but available time/memory/destination capacity remain practical limits.
- No dependencies, package scripts or public library exports changed.

**TDD/review:**

- Implementer reported 14 expected behavioral failures against importable
  incomplete execution/serialization contracts before implementation.
- Focused final suite: 16 passing tests, covering real files, valid/empty/
  malformed bytes, exact JSON shape, diagnostics/status, stream separation,
  asynchronous writers and propagated failures.
- Static review requested reducing the default 8,000-level synthetic test
  (over 100 MB output). Replaced with 2,000 levels, exact branch/leaf counts
  across chunks and complete result tail; real 1,200-operand integration
  retained. This is coverage-cost tuning, not a production behavior change.
- Implementer separately observed native pretty JSON fail at 8,000 levels,
  while iterative serialization completed; default final test depth is 2,000.
- Reviewer did not execute automated checks.

**Review status:** APPROVED after minor test revision by conductor inspection
and independent checks.

**Validation:**

- Conductor: 16 focused tests pass, type-check, build/public export smoke and
  whitespace checks pass. Final focused run took 2.92 seconds.
- Implementer reported full suite 575 passed before test-cost adjustment, plus
  built CLI-helper smoke; full suite not independently rerun.

**Next checkpoint:** User authorized commit/continue on 2026-11-07 at 02:44
(+01:00). Phase 2 committed as `ab821e5`; Phase 3 wiring authorized.

**Git commit message:**

```text
feat(cli): parse files and stream complete JSON

Integrate source loading with the existing parser and route help,
results and operational errors to their designated output streams.
Return parse-aware status codes without forcing process exit.

Serialize complete results iteratively with awaited chunk writes.
Cover malformed bytes, exact output, deep trees and writer failures.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
