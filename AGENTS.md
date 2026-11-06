# Compiler project guidance

## Start here

- Read [current knowledge](Kontext/Wissensstand.md), the relevant entries in
  [project history](Kontext/Kontextprotokoll.md), and
  [Language Design](docs/design-research/Language-Design.md) before compiler work.
- The language design's approved decisions define behavior. Respect explicit
  supersessions; historical examples and experiment inventories are not new
  requirements. Flag conflicts rather than silently choosing a language rule.
- TypeScript is selected (DEC-054). Build the generic compiler base, lexer, and
  parser first. Semantic analysis, an AST, runtime, and code generation are not
  part of this initial implementation.

## Test-driven development

- For every behavior change, first add a focused automated test and run it.
  Confirm that it fails for the missing behavior, not a tooling/setup problem.
- Implement the smallest complete change, rerun the test to green, then refactor
  while keeping tests green. Add regression tests before fixing bugs.
- Associate language conformance tests with the relevant DEC/REQ identifiers.
  Assert token boundaries, tree structure, diagnostics, and source preservation,
  not merely successful execution or snapshots without meaningful assertions.
- Test invalid input as well as valid input. A returned tree with error
  diagnostics must not be reported as a successful parse.
- Run the focused tests and type-check for the changed slice, then relevant
  integration/regression tests. Do not claim checks passed unless actually run.
- Use the README's verified commands once the foundation phase establishes
  the package and test harness. Do not invent commands.
  Documentation-only edits do not require a fabricated red/green cycle.

## Implementation boundaries

- Keep the base small and directly useful to the frontend: source input,
  diagnostics, shared contracts, and public entry points. Avoid speculative
  plugin frameworks or backend abstractions.
- Preserve original UTF-8 bytes and physical locations independently of
  translated text and normalized token values. Pin Unicode behavior to 18.0.0;
  do not rely on an unverified host Unicode version.
- Follow [frontend instructions](.github/instructions/compiler-frontend.instructions.md)
  when changing source or tests.
- Keep source contracts documented following the
  [JSDoc instructions](.github/instructions/jsdoc.instructions.md).

## Planning and continuity

- Plan directory: `plans/`. Follow the
  [approved compiler plan](plans/compiler-frontend-plan.md), approved 2026-11-06.
  Phase 1 is authorized; later phases retain their confirmation checkpoints.
- Keep each implementation phase independently tested and reviewable. Report
  red/green evidence, changed behavior, remaining questions, and review results;
  stop for user confirmation before committing or starting the next phase.
- Update both context records for material requirements, decisions, unresolved
  questions, and verification results. Distinguish proposals from approved
  behavior and tested implementations.
