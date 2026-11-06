## Phase 8 Complete: Integrated Recovery and Frontend Conformance

The byte-to-CST pipeline now retains complete trees on malformed source,
collapses errors across trivia, classifies their roles under DEC-068/092 and
preserves each diagnostic. Reconstruction walks original source ranges in CST
order and rejects missing, overlapping or reordered coverage.

**Files created/changed:**

- [Recovery and grouping](../src/parser/grouping.ts)
- [Precedence parser](../src/parser/precedence.ts)
- [CST contracts](../src/cst/cst.ts)
- [Byte reconstruction](../src/cst/reconstruction.ts)
- [Public exports](../src/index.ts)
- [Recovery conformance tests](../tests/recovery-conformance.test.ts)
- [Grouping tests](../tests/grouping-parser.test.ts)
- [Precedence tests](../tests/precedence-parser.test.ts)
- [Built-export smoke](../tests/built-exports.mjs)
- [README](../README.md), [Language Design](../docs/design-research/Language-Design.md)
  (DEC-092), both context records, phase and overall completion records.

**Functions/contracts added or changed:**

- `structureCore`: linear error collapse, role selection and minimal insertion
  subject to fixed lexical operand roles. Interior trivia belongs to collapsed
  errors; each constituent token/region and diagnostic remains distinct.
- `CstErrorPart`, `CstErrorComponent`, revised `CstError`, `CstErrorOperator`.
  Designated error operands force their entire collapsed run to operand under
  user-approved DEC-092. Other runs use DEC-068; ties remain operands.
- `parseCore`/`parseSource`: error operands retain leaves; error operators bind
  most tightly with left associativity (`ERROR_OPERATOR_PRECEDENCE`).
  Malformed input retains trees and diagnostics with error status.
- `reconstructSource`: iterative ordered structural traversal and byte-range
  partition validation. Inserted nodes contribute no original bytes.
- Synthetic and normalized-literal diagnostic span policies remain unchanged.
  Complete source JSDoc and API migration documentation maintained.

**TDD and review evidence:**

- Initial implementation report: 46 of 47 new integration tests failed
  behaviorally against Phase 7, then passed after implementation.
- Initial static review blocked on conflicting role interpretations and
  insufficient independent coverage of known/mixed operand errors.
- User selected fixed operand roles, including mixed collapsed runs, at
  23:16 (+01:00), recorded as DEC-092/KP-107. Contextual reclassification of
  every error was rejected. Existing provisional code already matched;
  documentation and constrained-oracle/full-tree coverage were extended.
  Some new fixtures initially had incorrect expectations, corrected as test
  errors; no behavioral-red claim is made for those coverage-only additions.
- Final static review found three unbounded function-call spreads when
  flushing trivia. Three 200,000-comment regressions each failed with
  `RangeError: Maximum call stack size exceeded` before replacing spreads
  with iterative appends. Tests then passed with exact trivia/byte retention.
- Added touching-operand mixed-order/comment fixtures and reconstruction
  overlap/reorder rejection tests as requested.
- Reviewers performed static review, not runtime verification. Conductor
  inspected the final revisions and independently ran validation.

**Review status:** APPROVED after revisions by conductor inspection and
verification. Both NEEDS_REVISION reports are resolved: DEC-092 policy,
known/mixed/touching coverage, large-trivia crash and reconstruction negatives.

**Final verification:**

- `npm test`: **541 tests pass in ten files** (62 more than Phase 7).
- `npm run typecheck`: pass.
- `npm run smoke:exports`: pass, including build.
- `git diff --check`: pass.
- Recovery-focused suite reported 62 tests; combined focused verification
  reported 73 tests. Counts are runner tests, not individual oracle cases.
- Exhaustive independent fallback oracle: all 5,460 sequences of lengths 1–6.
  Additional constrained fixtures assert designated operand roles, exact trees,
  insertion counts, spans, diagnostics and original-byte reconstruction.
- Scale tests: 50,000 error parts, 20,000 error operators, 20,000 nested
  unclosed groups and 200,000 trivia entries on each flush path.
- Full Unicode normalization fixture remains covered (201,710 comparisons).
- No dependencies or generated-data changes. Unrelated `.trunk/` untouched.

**Next checkpoint:** All eight implementation phases complete; user authorized
the final commit on 2026-11-06 at 23:50 (+01:00), KP-109. This record accompanies
the commit below. Clarify next scope before new implementation. No semantic analysis, AST,
numeric suffix interpretation, runtime or backend has been added.

**Git commit message:**

```text
feat(frontend)!: complete recovery and conformance

Collapse errors across trivia while retaining original components and
diagnostics. Preserve designated operand roles under DEC-092 and give
contextual error operators tightest left-associative binding.

Retain malformed-input trees and reconstruct bytes from validated CST
coverage. Add exhaustive role checks, mixed-error fixtures and scale
regressions; avoid argument-limit crashes when flushing large trivia runs.

BREAKING CHANGE: CstError now owns components and a resolved role.
Read source/errorKind from its parts instead of CstError directly.
CstOperator includes error operators; unresolved error barriers are gone.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
