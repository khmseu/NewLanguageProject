## Plan Complete: Compiler Foundation and Frontend

The approved TypeScript foundation, Unicode-pinned lexer and generic binary
CST parser are implemented. The pipeline preserves original UTF-8 bytes and
trivia, recovers malformed source without losing trees or diagnostics, and
reconstructs bytes from ordered CST ranges. All eight implementation phases
are complete; the final phase awaits user commit authorization.

**Phases Completed: 8 of 8**

1. [Generic foundation](compiler-frontend-phase-1-complete.md)
2. [Source decoding, Unicode and provenance](compiler-frontend-phase-2-complete.md)
3. [Core tokens, trivia and normalization](compiler-frontend-phase-3-complete.md)
4. [Character/string/raw literals](compiler-frontend-phase-4-complete.md)
5. [Numeric candidates and lexical recovery](compiler-frontend-phase-5-complete.md)
6. [Delimiter grouping and implicit elements](compiler-frontend-phase-6-complete.md)
7. [Precedence binary CST](compiler-frontend-phase-7-complete.md)
8. [Integrated recovery/conformance](compiler-frontend-phase-8-complete.md)

**Files created/modified across the plan:**

- Guidance: [AGENTS.md](../AGENTS.md),
  [frontend instructions](../.github/instructions/compiler-frontend.instructions.md),
  [JSDoc instructions](../.github/instructions/jsdoc.instructions.md).
- Tooling: [package.json](../package.json), [lockfile](../package-lock.json),
  [TypeScript config](../tsconfig.json),
  [build config](../tsconfig.build.json), [Vitest config](../vitest.config.ts),
  [.gitignore](../.gitignore).
- Public API: [index](../src/index.ts),
  [diagnostics/result contracts](../src/diagnostics/diagnostic.ts).
- Source: [input](../src/source/source-input.ts),
  [processing](../src/source/source-processing.ts),
  [Unicode adapter](../src/source/unicode-data.ts),
  [normalization](../src/source/unicode-normalization.ts),
  [generated data](../src/source/unicode-normalization-data.ts),
  [line endings](../src/source/line-endings.ts).
- Lexer: [core](../src/lexer/core-lexer.ts),
  [literals](../src/lexer/literal-scanner.ts),
  [numbers](../src/lexer/numeric-scanner.ts).
- CST/parser: [contracts](../src/cst/cst.ts),
  [reconstruction](../src/cst/reconstruction.ts),
  [grouping](../src/parser/grouping.ts),
  [precedence](../src/parser/precedence.ts).
- Tests: [input](../tests/source-input.test.ts),
  [diagnostics](../tests/diagnostic.test.ts),
  [source processing](../tests/source-processing.test.ts),
  [normalization](../tests/unicode-normalization.test.ts),
  [core lexer](../tests/core-lexer.test.ts),
  [literal lexer](../tests/literal-lexer.test.ts),
  [numeric lexer](../tests/numeric-lexer.test.ts),
  [grouping](../tests/grouping-parser.test.ts),
  [precedence](../tests/precedence-parser.test.ts),
  [recovery conformance](../tests/recovery-conformance.test.ts),
  [built exports](../tests/built-exports.mjs).
- Unicode reproducibility:
  [generator](../scripts/generate-unicode-normalization.mjs),
  [official fixture](../tests/fixtures/NormalizationTest-18.0.0.txt).
- Documentation: [README](../README.md),
  [Language Design](../docs/design-research/Language-Design.md),
  [current knowledge](../Kontext/Wissensstand.md),
  [history](../Kontext/Kontextprotokoll.md), the [approved plan](compiler-frontend-plan.md),
  all eight phase records above and this completion record.

**Key public entry points:**
`SourceInput`, `processSource`, Unicode18 normalization, `scanCoreAt`,
`lexCore`, `structureCore`, `parseCore`, `parseSource`, `reconstructSource`.
No keywords, separate AST or construct-specific parser were introduced.

**Final verification:**

- 541 passing runner tests in ten files; build/export smoke also passes.
- Independent exhaustive role oracle: 5,460 sequences plus constrained
  DEC-092 mixed/designated operand fixtures.
- Official Unicode18 normalization: 201,710 comparisons.
- Type-check and whitespace validation pass.
- Stress coverage includes 20,000 nested groups/error operators, 50,000 error
  parts and 200,000 comments per trivia flush path.
- Per-phase records distinguish reported red evidence, static review and
  conductor-executed checks. Phase 2's recorded TDD evidence exception remains;
  completion does not retroactively claim assertion-level red for every slice.

**Commit status:**
Planning `08c381a`; phases 1–3 `5fa5ce9`, `aa36992`, `7823575`;
JSDoc `185b5a4`; phases 4–7 `5f43c73`, `e2afc57`, `6a0e637`, `d91ffb4`.
Phase 8 and this final checkpoint accompany
`feat(frontend)!: complete recovery and conformance`, authorized by the user
on 2026-11-06 at 23:50 (+01:00); retrieve its hash from Git history.
Unrelated `.trunk/` excluded.

**Next steps:** Clarify the next scope after the authorized final commit. Further language
semantics, name/type analysis, numeric rounding/suffix meanings, runtime and
code generation need separately agreed work; they are outside this plan.
