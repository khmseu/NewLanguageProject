## Phase 6 Complete: Delimiter Structure and Implicit Elements

The structural parser groups delimiters and inserts minimal APPLY/EMPTY
elements independently at file and group scope. It retains trivia, original
tokens and diagnostics; it is not yet a precedence tree or completed parse.

**Files created/changed:**
- [CST contracts](../src/cst/cst.ts)
- [Grouping and insertion](../src/parser/grouping.ts)
- [Public exports](../src/index.ts)
- [Structural tests](../tests/grouping-parser.test.ts)
- [Built-export smoke](../tests/built-exports.mjs)
- [README](../README.md)
- Both context records and phase completion records.

**Functions/contracts added:**
- `structureCore(CoreLexResult): CoreStructureResult`.
- Shallow `CstSequence`, recursive `CstGroup`, token/EMPTY operands,
  explicit/APPLY operators, trivia/error entries and grouping diagnostics.
- Explicit-stack grouping retains mismatched closers relative to the innermost
  opener as errors, without prematurely closing ancestors. Outstanding closers
  are diagnosed and inserted at EOF.
- Known lexical operand errors participate as operands. Unresolved errors are
  explicit insertion barriers pending Phase 8 classification/collapse.

**DEC-088 implementation choices:**
- Synthetic spans are zero-width original-byte ranges, never invented bytes.
- Leading/between-token insertions anchor at the following significant token's
  start; trailing EMPTY anchors at the preceding operator's end.
- Empty/trivia-only files anchor EMPTY at EOF. Empty groups anchor EMPTY at
  the closer's start, or EOF for a missing closer.
- All missing closers anchor at EOF. Group spans run from the source opener
  through the real or synthetic closer; interior spans exclude delimiters.
- Source entries retain original order and byte provenance, including BOM and
  global escape spelling. README documents these choices and API limitations.

**Tests and TDD evidence:**
- Implementer reported eight failing behavioral tests against the importable
  unimplemented `structureCore` skeleton, then 11 focused tests passing.
- Coverage includes explicit token fixtures independent of lexing, minimal
  insertion, all delimiter families, empty/trivia/comment/BOM-only scopes,
  group boundaries, unexpected/mismatched closers, nested EOF insertion,
  lexical error retention, exact spans, reconstruction and 1,500-level nesting.
- Review requested an accurate diagnostic for a root closer with no opener,
  plus corrected helper JSDoc for known-role errors. The exact-message
  regression failed before the diagnostic fix; all 11 focused tests then passed.

**Review status:** APPROVED after revisions by conductor inspection and
independent verification. Static reviewer initially requested the two minor
corrections above; reviewer did not execute automated checks.

**Final verification:**
- `npm test`: **443 tests pass in eight files**.
- `npm run typecheck`: pass.
- `npm run smoke:exports`: pass, including build.
- `git diff --check`: pass.
- No dependencies or generated-data changes.

**Next checkpoint:** User confirmed commit/continue on 2026-11-06 at 21:52
(+01:00). Phase 6 committed as `6a0e637`; Phase 7 implementation authorized.
Final contextual error classification/collapse and compiler-result conformance
remain Phase 8 work.

**Git commit message:**

```text
feat(parser): group delimiters and insert elements

Add lossless structural CST contracts and explicit-stack grouping.
Insert minimal APPLY and EMPTY elements with documented byte anchors,
retain trivia and errors, and recover missing delimiters at EOF.

Add test-first structural coverage, deep nesting and export smoke tests.
Keep precedence parsing and contextual error recovery deferred.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
