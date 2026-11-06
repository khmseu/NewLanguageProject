## Plan: Compiler Foundation and Frontend

Approved by the user on 2026-11-06 at 17:05 (+01:00), including the proposed
strict TypeScript, Node.js LTS, npm, and Vitest toolchain. Build a small generic
compiler base, then the lexer and generic operator/operand parser defined in
[Language Design](../docs/design-research/Language-Design.md). Return diagnostics
and a lossless binary CST; defer AST, semantics, runtime, and code generation.

The [original roadmap](../Kontext/Wissensstand.md#proposed-compiler-implementation-plan)
contains the detailed acceptance categories. Approval is recorded in KP-092 in
[project history](../Kontext/Kontextprotokoll.md).

### Execution contract

Every behavior slice follows tests first, expected behavioral red, minimal
complete implementation, green, then refactor with regression checks. A broken
harness or missing dependency is not behavioral red. Initial tooling and
documentation do not need artificial failing tests. Review each green phase,
report actual checks, and pause for user commit/continue confirmation. The
current request authorizes the planning commit and starting Phase 1, not
automatic advancement through every phase.

Create modules only when needed: public exports in `src/index.ts`, source input
in `src/source/`, diagnostics in `src/diagnostics/`, then `src/lexer/`,
`src/cst/`, and `src/parser/`. Mirror tests under `tests/`. Choose concrete
versions and commands in Phase 1; retain reproducible dependency versions and
a lockfile. Do not introduce a plugin framework or a fake parser.

### Phases

1. **Phase 1: Generic compiler foundation**
   - **Objective:** Working package/harness and typed byte-source, diagnostic,
     and explicit outcome contracts.
   - **Files:** Package/TypeScript/test configuration, README,
     `src/index.ts`, `src/source/`, `src/diagnostics/`, corresponding tests.
   - **Tests:** Original-byte preservation and mutation isolation; half-open
     byte slices and invalid ranges; diagnostic code/severity/location;
     error outcomes cannot claim success; public exports/build compatibility.
   - **Steps:** Configure harness; write and run failing behavior tests;
     implement the small base; run tests green and refactor; type-check/build;
     document supported versions and exact commands; review.

2. **Phase 2: Source decoding, Unicode, and provenance**
   - **Objective:** UTF-8 decoding, physical locations, global one-pass Unicode
     translation, and original-byte mappings.
   - **Files:** `src/source/`, verified Unicode-data adapter, source tests.
   - **Tests:** BOM/multibyte offsets, all hard breaks, scalar columns/tabs,
     maximal-subpart invalid UTF-8, invalid scalar escapes, backslash
     eligibility, generated breaks, mixed-origin CRLF, and provenance.
   - **Steps:** Verify Unicode 18.0.0 data availability/provenance; write failing
     conformance tests; implement the source layer; run green/refactor and
     version-mismatch regressions; type-check and review. Report a blocker
     rather than substituting host Unicode behavior.

3. **Phase 3: Core lexer and lossless token stream**
   - **Objective:** Tokens/trivia, identifiers, operators, delimiters,
     whitespace, and comments over translated text.
   - **Files:** `src/lexer/`, token/trivia models, lexer tests and fixtures.
   - **Tests:** XID boundaries, rejected leading underscore, case-sensitive
     NFC display/NFKC lookup, longest operators, delimiters, Unicode whitespace,
     non-nested comments, separation, EOF and embedded Unicode diagnostics,
     complete byte/trivia/BOM coverage.
   - **Steps:** Write failing core scanner tests; implement only this slice
     without approximating numeric/literal scanners; run green/refactor;
     type-check and review.

4. **Phase 4: Character, ordinary-string, and raw-string lexing**
   - **Objective:** Selected literal syntax and values.
   - **Files:** Literal scanners/validators, normalization provenance, tests.
   - **Tests:** All selected/rejected escapes, Unicode names/aliases,
     one-scalar characters, NFC-before-escapes but never afterward,
     physical/generated continuation, interrupted/unterminated literals,
     tagged raw strings, literal backslashes, LF normalization, intact
     constructs containing Unicode errors.
   - **Steps:** Write failing valid/invalid tests with exact extents and
     diagnostics; implement literals; run green/refactor and source
     regressions; type-check and review.

5. **Phase 5: Unified numeric candidates and lexical recovery**
   - **Objective:** Unified numeric matcher followed by classification and
     validation, plus full lexer recovery.
   - **Files:** Numeric scanner/validator and recovery, lexer integration tests.
   - **Tests:** Radices, decimal/hex floats, suffix ambiguity, separators,
     incomplete/invalid extents, DEC-083 touching identifier/number runs,
     minimal fallback, and progress on malformed input.
   - **Steps:** First obtain agreement on Q-014's exact permissive candidate
     grammar and length policy and update the design; write failing tests;
     implement without shorter-valid-token fallback or semantic suffix typing;
     run green/refactor and full lexer regressions; type-check and review.

6. **Phase 6: Delimiter structure and implicit elements**
   - **Objective:** Nested groups and minimal alternating operand/operator
     representation, independently tested using explicit token fixtures.
   - **Files:** `src/parser/` grouping/insertion, `src/cst/` contracts, tests.
   - **Tests:** Minimal APPLY/EMPTY insertion, boundary/empty operands,
     recursive group kinds/interior boundary, mismatched innermost closers,
     unexpected closers and EOF insertion, retained trivia.
   - **Steps:** Document DEC-088 synthetic-span choices; write failing
     structural tests; implement grouping/insertion; run green/refactor and
     regressions without inventing original bytes; type-check and review.

7. **Phase 7: Precedence-based binary CST parser**
   - **Objective:** Binary operator/operand CST with comments and provenance.
   - **Files:** Precedence table/tree construction, concrete CST nodes, public
     parse entry point, parser tests.
   - **Tests:** Every precedence boundary and associativity, non-associative
     chains, exponentiation, dot/arrow, generic unary EMPTY trees, `a * -b`,
     conditional nesting, sequence/list trees, generic language-form trees.
   - **Steps:** Write failing exact-tree tests; implement approved priorities
     and generic syntax without keyword/construct productions; run
     green/refactor and structural regressions; type-check and review.
     Predefined identifiers, operand legality, and `::` meaning remain semantic.

8. **Phase 8: Integrated recovery and frontend conformance**
   - **Objective:** Complete byte-input-to-CST API and error-result contract.
   - **Files:** Integrated recovery/diagnostics, public exports, reconstruction,
     integration fixtures/tests, API documentation.
   - **Tests:** Contextual error classification, collapse across trivia,
     tightest left-associative operator errors, multiple diagnostics,
     normalized-literal and synthetic spans, exact byte reconstruction
     including invalid UTF-8/BOM/escapes, progress, and no success with errors.
   - **Steps:** Write failing integration/conformance tests; implement remaining
     recovery; run green/refactor; run full tests, type-check, and build;
     document API/limits, review, and report deferred semantic work.

### Open questions

1. Which exact numeric candidate grammar and length policy should Q-014 adopt?
2. Which verified Unicode 18 data provider satisfies the complete source contract?
3. Which parser algorithm and CST/span layouts best preserve the approved model?

Only question 1 requires a language decision before the numeric matcher.
Representation and mapping choices remain implementation choices under DEC-088,
subject to documented rationale and tests.
