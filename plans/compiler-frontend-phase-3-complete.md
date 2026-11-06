## Phase 3 Complete: Core Lexer and Lossless Token Stream

The core scanner recognizes identifiers, all selected operators/delimiters,
Unicode whitespace, and comments over translated source. It preserves byte
coverage and explicitly defers numeric/literal surfaces. Identifier display
and lookup forms use Unicode 18 NFC/NFKC, never host normalization.

**Files created/changed:**
- [Core scanner](../src/lexer/core-lexer.ts)
- [Normalization implementation](../src/source/unicode-normalization.ts)
  and [generated tables](../src/source/unicode-normalization-data.ts)
- [Table generator](../scripts/generate-unicode-normalization.mjs)
- [Core scanner tests](../tests/core-lexer.test.ts),
  [normalization conformance tests](../tests/unicode-normalization.test.ts),
  [official fixture](../tests/fixtures/NormalizationTest-18.0.0.txt)
- [Public exports](../src/index.ts), [export smoke](../tests/built-exports.mjs),
  [README](../README.md), context records, this record, and Phase 2 commit status

**Functions/contracts created:**
- `scanCoreAt(source, unitOffset)` recognizes one core surface at a translated
  scalar offset; invalid offsets throw `RangeError`.
- `lexCore(input)` returns the source, ordered tokens/trivia/unsupported or
  deferred regions, diagnostics, and explicit completeness status.
- Core tokens preserve translated spelling and byte/scalar ranges.
  Identifiers carry NFC display and NFKC lookup values. Comments separate
  tokens; Unicode errors inside comments retain the comment construct.
- BOM trivia and item ranges cover original bytes. At a deferred numeric or
  literal start, the stream retains the entire unscanned suffix with explicit
  deferred coverage rather than pretending it is a recognized token.
- `normalizeUnicode18(input, form)` supports NFC/NFKC using decomposition,
  canonical ordering/composition, exclusions, and algorithmic Hangul.

**TDD evidence reported by implementation:**
- Importable skeleton was verified before assertions: initial core suite
  produced 8 behavioral failures, not missing imports/APIs.
- Implemented slices reached green; supplementary-character deferred-offset
  and dot-digit deferral regressions each first failed (one test), then passed
  after fixes. Focused final lexer/API suite: 15 passing tests.
- Initial normalization behavior was also absent in the red stage. The later
  full official conformance run is validation, not a separately claimed
  retrospective behavioral-red run.
- Reviewer-requested plus/minus inventory additions passed against existing
  implementation; those are coverage additions, not new behavior.

**Verification:** Conductor reran `npm test` (110 passing tests in five files),
`npm run typecheck`, `npm run smoke:exports` (includes build), and
`git diff --check`; all passed.

**Unicode conformance and provenance:**
- Generated minimal normalization data from official Unicode 18
  `UnicodeData.txt` and `DerivedNormalizationProps.txt` using SHA-256-verified
  inputs. Exact URLs, checksums, and regeneration procedure are documented in
  the generator and README. The implementer reproduced output byte-for-byte.
- Committed official normalization fixture has SHA-256
  `25a50d816764b04abfb4a646d3eb2b2a803284c3873d9a06757b94fe4513dde3`,
  verified by conductor.
- Tests check all 20,171 fixture rows, all five input columns for each of NFC
  and NFKC: 201,710 normalization comparisons. Official licensing/attribution
  is retained. The roughly 2.9 MB fixture is intentional conformance data;
  runtime tables are roughly 227 KB, not the complete raw UCD.
- Existing pinned Unicode 18 package supplies XID and whitespace properties;
  host Unicode 17 normalization is not used.

**Review status:** APPROVED. Static review had two non-blocking recommendations:
cover `+`/`-` in the operator inventory test, and put exact source URLs in the
generator. Both were addressed before final conductor verification. Reviewer
did not execute tests; runtime verification above is from conductor.

**Checkpoint:** Phase 2 was committed as `aa36992` on user confirmation before
this phase. The user authorized the Phase 3 commit on 2026-11-06 at 18:56
(+01:00), without requesting continuation (KP-096). This record accompanies
that commit; retrieve its hash from Git history. Phase 4 remains paused.
Next is Phase 4 literals; numeric grammar remains the Phase 5
approval gate. This is deliberately not yet a full lexer or a parser.

**Git commit message:**

```text
feat(lexer): add lossless core token scanning

Recognize identifiers, operators, delimiters, whitespace, and comments
while preserving source byte coverage and diagnosed malformed input.
Represent numeric and literal starts as explicit deferred boundaries.

Add Unicode 18 NFC and NFKC from reproducible checksum-verified tables,
with complete official normalization fixture comparisons and test-first
scanner regressions. Document the partial lexer API and data provenance.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
