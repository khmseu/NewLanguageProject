## Phase 3 Complete: Runnable Command and Documentation

The CLI now runs through npm or the built Node entry point. It preserves
complete JSON stdout, waits for stream completion/backpressure and sets exit
status without forcing early process exit.

**Files created/changed:**

- [Process entry](../src/cli/main.ts)
- [Node stream writer](../src/cli/stream-writer.ts)
- [Argument documentation](../src/cli/arguments.ts)
- [Execution documentation](../src/cli/execute.ts)
- [Package command](../package.json)
- [Process tests](../tests/compiler-cli-process.test.ts)
- [README](../README.md), context records and completion records.

**Functions/contracts:**

- Package `parse` builds quietly, then runs the emitted entry only on success.
  Normal npm banners remain npm behavior; `npm --silent run parse -- path`
  keeps stdout machine-readable. Direct `node dist/cli/main.js path` reuses
  an existing build.
- Entry invokes `executeCli`, sets `process.exitCode`, and reports unexpected
  execution errors to stderr with nonzero status.
- `writeNodeStream` waits for the write callback and required drain event,
  propagates output failures, and removes temporary listeners on settlement.
- Existing 0/1/2 status, help, single path and raw-byte parser contracts unchanged.
- No dependencies added; script-only package change needs no lockfile update.

**TDD/review:**

- Implementer reported ten behavioral process-test failures against the unwired
  CLI before implementation, then green.
- Static review requested cross-platform npm invocation instead of spawning
  npm's command shim without a shell. Tests now invoke Node plus a validated
  `npm-cli.js`, with lifecycle-path and standalone discovery. Three launcher
  tests initially failed before the revision. No unsafe shell interpolation.
- Added actual npm help coverage. The final focused suite has 16 tests.
- Process tests drain stdout/stderr asynchronously, including output larger
  than pipe capacity, and check help/usage, Unicode/spaced/hyphen paths,
  empty/recovered files, malformed UTF-8 diagnostic bytes and I/O failures.
- Stream tests check awaited backpressure and asynchronous destination failure.
- Review was static-only. Conductor inspected the launcher revision and
  independently executed final checks; Windows runtime was not available.
  Simulated Windows installation selection does not prove Windows execution.

**Review status:** APPROVED after revisions by conductor inspection and
verification; static review's npm-launcher portability finding addressed.

**Final verification:**

- Conductor: focused process suite **16 passed**, type-check, build/export smoke
  and whitespace check pass.
- Conductor full suite: `npm test -- --maxWorkers=1`: **591 passed in 13 files**.
- Implementer reported standalone focused run without `npm_execpath` also green.
- A default parallel full run initially timed out an existing scale test;
  isolated and serial full runs passed. Worker limits were used for final
  validation without changing test configuration or weakening assertions.
- Permission-denied test is conditional when root/Windows prevents reliable
  permission behavior; missing-file/directory failures always tested.
- Project-local scratch files cleaned; no persistent helper process.

**Next checkpoint:** All three CLI phases implemented. Phase 3 remains
uncommitted; await explicit commit authorization.

**Git commit message:**

```text
feat(cli): add runnable source parse command

Build and launch the parser through npm with a direct built entry.
Await Node stream writes and backpressure, preserve complete JSON
output and report failures without forcing early process exit.

Add portable npm and process integration tests for arguments, raw
input, recovered results, output completion and status codes.
Document silent piping and direct built-command usage.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
