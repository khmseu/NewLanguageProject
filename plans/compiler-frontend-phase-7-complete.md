## Phase 7 Complete: Precedence-Based Binary CST

The parser builds generic binary expression trees using the approved operator
levels and associativities. Trees retain groups and source operators, while
each scope retains its lossless structural sequence and trivia. No keywords,
special unary grammar, conditional reassociation or semantic checks were added.

**Files created/changed:**
- [Precedence parser and table](../src/parser/precedence.ts)
- [CST contracts](../src/cst/cst.ts)
- [Public exports](../src/index.ts)
- [Precedence tests](../tests/precedence-parser.test.ts)
- [Built-export smoke](../tests/built-exports.mjs)
- [README](../README.md), both context records and phase completion records.

**Functions/contracts added:**
- `parseSource(SourceInput)` and `parseCore(CoreLexResult)`.
- `OPERATOR_PRECEDENCE`, `OperatorPrecedence`, `OperatorAssociativity`:
  all 22 DEC-022 levels and DEC-066 level associativities.
- `CstExpression` binary nodes, parsed groups, known-role error operands,
  parsed scopes, parser diagnostics and `CstParseResult`.
- Iterative shunting-yard reduction avoids operator-chain recursion. Separate
  iterative post-order traversal parses nested scopes before their parents.
- Non-associative chains receive diagnostics and a deterministic left-reduced
  partial tree; grouping separates otherwise conflicting operators.
- Binary spans run from the left child's start through the right child's end
  in original bytes. Trivia is retained in each scope's structural sequence.
  Phase 6 synthetic span rules remain unchanged.

**Tests and TDD evidence:**
- Implementer reported 31 of 32 initial tests failed behaviorally against an
  importable skeleton because trees were absent. One later expected span had
  an off-by-one fixture error; correcting that assertion was not a production fix.
- Initial focused green: 33 tests. Static review approved; its minor misleading
  test-title recommendation was addressed.
- Added three parser-level stress tests: 1,500 nested groups and 5,000-operator
  left- and right-associative chains, inspected iteratively for exact depth
  and node counts. These passed without production changes.
- Final focused coverage: 36 tests. Tests assert every adjacent precedence
  boundary and level associativity, complete table spellings, mixed
  non-associative chains, exponents, dot/arrow, APPLY, EMPTY unary-looking
  forms including `a * -b` and `!a++`, generic conditionals, sequence/list
  and language-form trees, semantic-only `::`, spans and trivia.

**Review status:** APPROVED. Read-only static review found no implementation
issues. Reviewer did not execute automated checks; conductor ran them separately.

**Final verification:**
- `npm test`: **479 tests pass in nine files**.
- `npm run typecheck`: pass.
- `npm run smoke:exports`: pass, including build.
- `git diff --check`: pass.
- No dependencies or generated-data changes.

**Limits and next checkpoint:**
- Any error diagnostic produces `status: "error"`, never `"complete"`.
  Unresolved error roles leave that scope's expression undefined while
  retaining all structural entries. Known lexical operand errors retain trees.
- Contextual error classification, trivia-independent collapse, recovery around
  unresolved entries and full byte-to-CST conformance remain Phase 8.
- User confirmed commit/continue on 2026-11-06 at 22:39 (+01:00).
  Phase 7 committed as `d91ffb4`; Phase 8 authorized. Its policy-review blocker
  is recorded in KP-106; Phase 8 is not yet complete.

**Git commit message:**

```text
feat(parser): build precedence-based binary CST

Add iterative operator reduction and nested-scope traversal using the
approved precedence table and level associativity. Preserve groups,
trivia and byte provenance without construct-specific grammar.

Expose source and token-stream parse APIs with explicit error results.
Add test-first exact-tree coverage and deep-group/long-chain stress tests.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
