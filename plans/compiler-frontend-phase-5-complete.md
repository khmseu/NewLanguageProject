## Phase 5 Complete: Unified Numeric Candidates and Lexical Recovery

The lexer matches permissive numeric candidates before classification and
validation under DEC-089–091. It scans the full input, retaining numeric text,
malformed candidates, touching-operand errors and original-byte coverage.
No parser, numeric rounding or suffix semantics were added.

**Files created/changed:**
- [Numeric scanner](../src/lexer/numeric-scanner.ts)
- [Core scanner](../src/lexer/core-lexer.ts)
- [Public exports](../src/index.ts)
- [Numeric tests](../tests/numeric-lexer.test.ts)
- [Core tests](../tests/core-lexer.test.ts)
- [Literal tests](../tests/literal-lexer.test.ts)
- [Built-export smoke](../tests/built-exports.mjs)
- [README](../README.md)
- [Approved numeric decisions](../docs/design-research/Language-Design.md)
- [Current knowledge](../Kontext/Wissensstand.md),
  [history](../Kontext/Kontextprotokoll.md), and this record
- Previous phase completion record updated with its commit checkpoint.

**Functions/contracts added or changed:**
- `CoreNumber`: text-preserving integer, fraction, exponent and suffix
  components, bounded base, lowercase suffix key, validity and diagnostics.
- Unified numeric candidate matching/classification/validation, including
  decimal and hexadecimal floats, prefixed/radix integers and suffixes.
- `scanCoreAt`/`lexCore`: numeric tokens, malformed numeric operands,
  maximal touching identifier/number errors and shortest fallback runs.
  Unicode source-error units remain separate.
- Numeric deferral regions/statuses and exported `DeferredCoreRegion`/
  `DeferredSurfaceKind` types removed. Consumers migrate to full scanning
  and inspect numeric/error items and diagnostics; coverage is not success.
- Complete source JSDoc maintained; no dependency or generated-data changes.

**Test-first evidence:**
- Implementer reported initial behavioral red: 62 failed, two passed.
- Subsequent exponent regression: one failed, 67 passed before the fix.
- Reported focused green: 336 tests. Full-suite green independently verified
  below; red counts are implementer evidence, not retrospectively rerun.
- Numeric coverage includes exact DEC-090/091 sign/hash/tail boundaries,
  radix/suffix ambiguity, separators, empty components, long text without
  Number precision limits, touching operands, Unicode errors, progress and
  lossless original-byte ranges. Existing literal tests were adapted only
  for removal of numeric deferral.

**Review status:** APPROVED. Read-only Code-Review-subagent found no issues
in static review. It did not execute checks; conductor ran them separately.

**Final verification:**
- `npm test`: **432 tests pass in seven files**, including existing complete
  official Unicode normalization fixture coverage.
- `npm run typecheck`: pass.
- `npm run smoke:exports`: pass, including `npm run build`.
- `git diff --check` and `git diff --cached --check`: pass.
- No commit made; Phase 6 not started. Existing staged changes preserved.

**Next checkpoint:** User confirmed commit/continue on 2026-11-06 at 21:15
(+01:00). Phase 5 committed as `e2afc57`; Phase 6 implementation authorized.
The verification and no-commit statement above describe the original checkpoint.

**Git commit message:**

```text
feat(lexer)!: scan numbers and recover full input

Match unified numeric candidates before validation under the approved
component, exponent, radix and suffix boundary rules. Preserve numeric
text without eager value conversion or language-level length limits.

Merge touching identifier/number runs into error operands and recover
shortest unsupported runs while preserving original bytes and distinct
Unicode errors. Add test-first numeric coverage and document contracts.

BREAKING CHANGE: Numeric deferral regions, statuses and exported types
are removed. Consume numeric/error items from full scanning and inspect
diagnostics instead of stopping at a deferred suffix.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
