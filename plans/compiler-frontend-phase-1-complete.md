## Phase 1 Complete: Generic Compiler Foundation

The strict TypeScript ESM package now provides original-byte source input,
validated byte ranges, and typed diagnostics/results. The package builds and
its public ESM exports work; decoding, Unicode processing, lexing, and parsing
remain intentionally deferred.

**Files created/changed:**

- [Package manifest](../package.json) and [lockfile](../package-lock.json).
- [TypeScript configuration](../tsconfig.json),
  [build configuration](../tsconfig.build.json),
  [Vitest configuration](../vitest.config.ts).
- [Public exports](../src/index.ts),
  [source input](../src/source/source-input.ts),
  [diagnostic contracts](../src/diagnostics/diagnostic.ts).
- [Source tests](../tests/source-input.test.ts),
  [diagnostic tests](../tests/diagnostic.test.ts),
  [built-export smoke](../tests/built-exports.mjs).
- [README](../README.md), [.gitignore](../.gitignore), both context records,
  and this completion record.

**Functions/contracts created:**

- `SourceInput`: byte-backed input with defensive copies on construction,
  exposure, and slicing. Unsupported runtime inputs throw `TypeError`.
- `range()` and `slice()` / internal `validateByteRange()`: integer half-open
  original-byte bounds; immutable returned ranges; explicit `RangeError`.
- `ByteRange`, `Diagnostic`, severity/code/location types, and
  `CompilerResult<T, D>`: TypeScript success cannot contain errors; failure
  requires a first error diagnostic. These are static contracts, not runtime
  validation factories; future frontend producers must uphold them.

**Test-first evidence:**

- Initial source behavior suite failed 10/10 against incomplete behavior,
  exposing missing defensive copies and range validation, then passed 10/10.
- Review identified runtime constructor coercion and inconsistent malformed
  slice-range errors. Regression tests first produced 15 failures / 32 passes;
  after fixes the source suite passed 47/47.
- Final `npm test`: 49 tests pass across two files. Diagnostic tests include
  negative `@ts-expect-error` assertions checked by TypeScript.
- `npm run typecheck`, `npm run build`, `npm run smoke:exports`, and
  `git diff --check` all pass. The smoke imports through the package export map.

**Review status:** APPROVED after revisions. The reviewer's initial
NEEDS_REVISION findings were fixed test-first; conductor inspection verified
both fixes and reran all checks. The reviewer itself performed static review
only; execution results above are from implementation/conductor checks.

**Tooling and limits:** Verified on Node v26.13.0 (runtime LTS marker
`Lithium`), npm 12.2.2, TypeScript 7.0.2, Vitest 5.1.0, and
`@types/node` 26.6.6. Node 24 is declared supported but not locally tested.
The host reports Unicode 17.0; it is not evidence of Unicode 18 conformance.
No Unicode-dependent compiler behavior is implemented yet.

**Checkpoint:** Planning/support changes were committed as `08c381a`.
The user confirmed commit/continue on 2026-11-06 at 17:36 (+01:00).
Phase 1 was committed as `5fa5ce9` before starting Phase 2.

**Git commit message:**

```text
feat(compiler): add tested frontend foundation

Establish a strict TypeScript ESM package with pinned npm dependencies,
Vitest, declaration builds, and public-export smoke validation.

Preserve original source bytes with defensive copies and validated
half-open byte ranges. Add diagnostic and result types that distinguish
error-free success from failure, with runtime boundary regression tests.

Document verified commands and defer decoding, lexing, and parsing.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
