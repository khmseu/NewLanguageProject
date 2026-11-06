## Phase 2 Complete: Source Decoding, Unicode, and Provenance

Source processing now decodes original UTF-8 bytes and translates eligible
global Unicode escapes once, retaining byte provenance and physical positions.
A version-pinned Unicode 18 adapter provides identifier properties and
character names/aliases. No lexer/parser or token normalization is implemented.

**Files created/changed:**
- [Source processing](../src/source/source-processing.ts)
- [Unicode adapter](../src/source/unicode-data.ts)
- [Source conformance tests](../tests/source-processing.test.ts)
- [Public exports](../src/index.ts)
- [Package manifest](../package.json) and [lockfile](../package-lock.json)
- [Built-export smoke](../tests/built-exports.mjs)
- [README](../README.md), both context records, and this completion record

**Functions/contracts created:**
- `processSource()`: maximal-subpart UTF-8 decoding, initial BOM handling,
  scalar columns/physical lines, one-pass Java-style escape eligibility, and
  diagnosed replacements for malformed bytes/escapes.
- `SourceUnit` and `SourceProcessingResult`: translated text/scalars,
  original-byte ranges, physical positions, origin/error metadata, diagnostics,
  and `originalRange()` mapping translated scalar-unit ranges to byte ranges.
  Output remains available alongside diagnostics; this is not a parse-success
  result. Returned structures are frozen.
- `UNICODE_DATA_VERSION`, `assertUnicodeDataVersion()`, XID predicates, and
  character-name/official-alias lookup with ASCII-only name case folding.

**Unicode evidence:**
- The official versioned [UCD ReadMe](https://www.unicode.org/Public/18.0.0/ucd/ReadMe.txt)
  identifies final Unicode 18.0.0 data; checked locally during this phase.
- The pinned `@unicode/unicode-18.0.0@2.1.0` package reports MIT licensing and
  exports the Unicode 18 property/name data used by the adapter.
- Data-based tests include U+0558, whose age is 18.0 in official
  [DerivedAge](https://www.unicode.org/Public/18.0.0/ucd/DerivedAge.txt).
  The implementer also checked its XID/name entries in the versioned UCD files.
- Host Unicode 17 is not used for these operations. Unicode 18 normalization
  remains required before identifier/literal value normalization in later
  phases; this adapter does not provide normalization yet.

**Tests and verification:**
- 45 source-processing/data tests cover BOM/empty input, byte mapping/range
  boundaries, all physical breaks, CRLF of mixed translated origins,
  UTF-8 boundary/invalid sequences, literal versus replacement U+FFFD,
  one-pass escapes/eligibility, surrogate rejection, invalid UTF-8 inside an
  invalid escape, and Unicode 18 property/name lookup.
- Full `npm test`: **94 passing tests** in three files.
- `npm run typecheck`, `npm run smoke:exports` (includes build), and
  `git diff --check` all passed in conductor verification.
- Static review requested a literal-U+FFFD distinction test; it and additional
  boundary coverage were added and verified. README now separates physical
  original locations from logical translated CRLF handling.

**Review status:** Correctness findings resolved after revisions and conductor
inspection/checks. **TDD process exception remains:** the initial run failed
because APIs were absent, which is not the required behavioral red step.
The later regression additions passed immediately; they are coverage, not
red/green evidence. Do not describe this phase as fully compliant with strict
TDD or manufacture retrospective failures. Future behavior slices must show
an expected assertion failure against an importable API before implementation.

**Scope/next checkpoint:** Phase 1 committed as `5fa5ce9`. The user confirmed
commit/continue on 2026-11-06 at 18:18 (+01:00); Phase 2 was committed as
`aa36992` before starting Phase 3, the core lexer/trivia slice.
The physical/logical line-ending distinction and token-level normalization
policy remain unchanged; numeric grammar remains the Phase 5 approval gate.

**Git commit message:**

```text
feat(source): decode UTF-8 and Unicode escapes

Preserve original-byte provenance and physical scalar positions through
maximal-subpart decoding and eligible one-pass Unicode translation.
Return diagnosed replacement units alongside usable translated output.

Pin Unicode 18 identifier and character-name data, add source boundary
and malformed-input coverage, and document the public source API.
Record the missing behavioral-red evidence as a TDD process exception.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
