## Phase 4 Complete: Character, Ordinary-String, and Raw-String Lexing

The core scanner now recognizes and validates selected literal forms, preserves
original spelling/ranges, and exposes decoded values and diagnostics. Unicode18
NFC runs before ordinary escapes, never on decoded values afterward. Only
numeric surfaces remain deferred; no parser or numeric semantics were added.

**Files created/changed:**
- [Literal scanner](../src/lexer/literal-scanner.ts)
- [Shared line endings](../src/source/line-endings.ts)
- [Core scanner](../src/lexer/core-lexer.ts)
- [Normalization and contributor tracking](../src/source/unicode-normalization.ts)
- [Source processing](../src/source/source-processing.ts)
- [Public exports](../src/index.ts)
- [Literal tests](../tests/literal-lexer.test.ts),
  [core tests](../tests/core-lexer.test.ts),
  [normalization tests](../tests/unicode-normalization.test.ts),
  [export smoke](../tests/built-exports.mjs)
- [README](../README.md), context records, and this completion record

**Functions/contracts added or changed:**
- `scanLiteralAt`, `CoreLiteral`, `LiteralKind`, and `LiteralDiagnostic`:
  candidate extents, decoded values, validity/termination, ordinary escapes,
  tagged raw strings, EOF/line-ending recovery and character-length checks.
- Core scanning now consumes literals and exposes invalid literal candidates as
  operand-classified error tokens; numeric deferral remains explicit.
- `normalizeUnicode18WithOrigins` carries exact input contributors through
  decomposition, canonical reordering, and composition. Diagnostics use the
  smallest original-byte hull containing contributors (DEC-088); a hull may
  include intervening reordered bytes, not unrelated prefix/suffix bytes.
- Shared hard-ending helpers keep physical/global-generated/mixed-origin
  CRLF behavior consistent across comments, source positions and literals.
- Complete source JSDoc and API documentation maintained. Generated tables,
  third-party fixtures and dependency manifests are unchanged.

**Test-first evidence:**
- Implementer reported 234 assertion failures against importable incomplete
  literal behavior, not missing imports/setup, before implementation.
- Literal tests cover selected and rejected escapes, scalar characters,
  NFC ordering/no post-escape NFC, Unicode names/aliases, string continuation
  across selected physical/generated endings, raw tags/matching/EOF recovery,
  Unicode source errors, normalized diagnostic mapping and lossless ranges.
- Static review found that escape decoding could swallow multiple Unicode-error
  contributors. Five regression assertions failed before the fix; all passed
  afterward. Each source error now contributes its own replacement even when
  consumed by an escape candidate. A malformed enclosing escape remains
  independently invalid and contributes its own best-effort replacement.
- Direct normalization-contributor assertions additionally cover decomposition,
  reordering, composition, Hangul, and noncontiguous contributors.
- Some continuation fixtures were corrected to respect existing global
  backslash eligibility; these corrections are not new language decisions.

**Review status:** APPROVED after revisions by conductor inspection and
verification. Initial static review was NEEDS_REVISION for the lost Unicode
replacements; the fix and regression coverage were inspected afterward.
The reviewer did not execute tests; runtime checks below were rerun by conductor.

**Final verification:**
- `npm test`: **360 tests pass** in six files, including the complete existing
  official NFC/NFKC fixture comparisons.
- `npm run typecheck`, `npm run smoke:exports` (includes build), and
  `git diff --check`: pass.
- No dependencies added, no commit performed, Phase 5 not started.

**Next checkpoint:** Await commit/continue confirmation. Before Phase 5 matcher
implementation, obtain agreement on Q-014's exact unified numeric candidate
grammar/classification boundaries and length policy. Incomplete raw openers
retain unsupported fallback behavior; recognized raw openers retain intact EOF
recovery. Parser-level error classification/collapse remains later work.

**Git commit message:**

```text
feat(lexer): scan character and string literals

Decode ordinary and tagged raw literals with Unicode 18 NFC before
escapes, scalar validation, continuation, and lossless error recovery.

Track normalization contributors for original-byte diagnostics and
preserve embedded Unicode error replacements through escape decoding.
Add test-first literal coverage and maintain source JSDoc contracts.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
