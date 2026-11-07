# New Language compiler frontend foundation

This is a strict TypeScript ESM package for the compiler frontend foundation.
It provides original-byte source input, source decoding and Unicode
translation, a Unicode-18-pinned core scanner and lossless token/trivia stream,
diagnostic types, character/ordinary-string/tagged-raw literals, unified numeric
candidates, structural grouping, and a precedence-based binary CST parser.

## Runtime and tools

The package supports Node.js `^24.0.0 || >=26.0.0`, a subset of the installed
Vitest engine range. The foundation was verified with Node.js v26.13.0 (LTS,
runtime codename `Lithium`) and npm 12.2.2. Pinned development tools are
TypeScript 7.0.2, Vitest 5.1.0, and `@types/node` 26.6.6; `package-lock.json`
records the full dependency graph.

## Commands

From the repository root:

```sh
npm install
npm test
npm run typecheck
npm run build
npm run smoke:exports
```

`npm run smoke:exports` builds the package and imports it through the package's
public ESM export map.

## CLI status

Internal CLI support under `src/cli/` accepts arguments, reads original source
bytes and parses them. `executeCli(args, { stdout, stderr })` is async, awaits
the supplied text writers, and returns 0 for help or a complete parse, 1 for a
recovered parse with errors, and 2 for usage or file-read failures. Help and
the complete two-space formatted JSON parse result go to stdout; usage and read
errors go to stderr. Writer and unexpected parser failures propagate.

`--help` must appear alone. Exactly one source path is accepted; unknown options
are rejected, and a path beginning with `-` must follow `--`. Serialization is
iterative and streams chunks without truncation. Pretty-print indentation makes
deep output inherently quadratic in depth, and repeated nested structural and
parsed references can multiply the output size; time and destination capacity
still limit feasible inputs. This is not yet a runnable command, and there is
no `npm run parse` script; process wiring remains Phase 3.

## Foundation API

`SourceInput` accepts a `Uint8Array` of original UTF-8 source bytes; unsupported
runtime inputs throw `TypeError`. It copies the input on construction, and its
`bytes` getter and `slice()` method return copies, so callers cannot mutate
retained source data. The original bytes remain available even when decoding
requires replacements.

`ByteRange` follows DEC-036's zero-based, half-open byte offsets `[start, end)`
into those original bytes. `SourceInput.range(start, end)` and `slice(range)`
validate that both offsets are integers and
`0 <= start <= end <= byteLength`; invalid programmer-supplied ranges throw
`RangeError`, including null, undefined, malformed range objects, and nonnumeric
offsets passed to `slice()`. Ranges returned by `range()` are immutable. The
diagnostics' `SourceLocation` is this same byte-range shape.

`Diagnostic` carries a caller-selected string `code`, an `error`, `warning`,
or `info` severity, a message, and an original-byte `SourceLocation`.
`CompilerResult<T, D>` is a discriminated union: successful results contain
only warnings/information diagnostics, while failed results require at least
one error diagnostic. In TypeScript, provide failed diagnostics as a non-empty
tuple (commonly `[error] as const`) so the required error remains represented
in the type. The generic `D` can narrow the diagnostics used by a compiler
operation.

## Core lexer API

`lexCore(sourceInput)` returns a `CoreLexResult` with ordered `items`, source
processing output, diagnostics, and a coverage `status`. Core tokens cover
identifiers, numeric and character/string/raw-string literals, the approved source-operator inventory (longest match), and
`()`, `{}`, and `[]` delimiters. Whitespace, line comments, block comments,
and an initial BOM are explicit trivia items. Comments separate surrounding
tokens; block comments are non-nested and an unterminated one extends to EOF
with a diagnostic.

Every item exposes a translated-unit range and original half-open byte range.
Together the items partition the original input, including a BOM, global
escape spellings, trivia, and malformed bytes; use the corresponding
`SourceInput.slice(item.range.bytes)` to reconstruct each original segment.
Identifier `spelling`/`translatedText` is translated but unnormalized;
`displayName` is NFC and `lookupName` is NFKC. Matching uses Unicode 18
`XID_Start XID_Continue*` before normalization, and the original source is
never normalized.

`scanCoreAt(processedSource, unitOffset)` scans one item, including maximal
touching identifier/number runs as error operands. `lexCore` scans the whole
input. Unknown characters are explicit shortest unsupported runs with
`unrecognized-character` diagnostics; Unicode-error units remain separate.
`status` reports scanner coverage, not compiler success; inspect diagnostics
independently. Fallback regions and malformed Unicode units stay separate lexical
items; the parser (Phase 8, below) collapses and classifies them.

### Structural grouping API (Phase 6)

`structureCore(lexCore(input))` returns a `CoreStructureResult` with a shallow
`CstSequence` at file scope and recursively nested `CstGroup` operands for
`()`, `[]`, and `{}`. Within each scope, recognized operands and explicit
operators alternate using only the required implicit `APPLY` between adjacent
operands and `EMPTY` between adjacent operators or at operator boundaries.
Errors are collapsed and role-classified first (see Phase 8) and then take part
in alternation as operands or operators.
Groups are outer operands; their interior sequences get independent boundaries.
Empty and trivia-only files/groups contain one `EMPTY`. Trivia stays as ordered
entries, and source tokens retain original byte provenance. This is the lossless structural input to the Phase 7 precedence parser.

Synthetic `APPLY`/`EMPTY` spans are zero-width original-byte ranges. Their
anchor is the following significant token's byte start when inserted before
that token (including between adjacent significant tokens); a trailing `EMPTY`
uses the preceding operator's byte end. An entirely empty or trivia-only
file's `EMPTY` uses byte EOF. An empty group's `EMPTY` uses the actual closer's
byte start, or byte EOF when the closer is missing. Synthetic missing closers
are zero-width at byte EOF and have no source token or invented bytes. Tests pin
these choices to DEC-088.

`structureCore` carries all lexer diagnostics forward and adds explicit
unexpected-closer and missing-closer diagnostics. As of Phase 8 it also
collapses errors; DEC-092 fixes runs containing lexically designated operand
errors as operands, and DEC-068 contextually classifies the other runs (the
Phase 6 `unresolved` role and per-token `CstError.source`/`errorKind` no longer
exist). This API is structural output, not a parse success result.

### Precedence parser API (Phase 7)

`parseSource(new SourceInput(bytes))` runs the core lexer, delimiter grouping,
implicit `APPLY`/`EMPTY` insertion, and precedence parser. `parseCore(lexCore(input))`
accepts an existing lexer result. Both return `CstParseResult`:

```ts
const result = parseSource(
  new SourceInput(new TextEncoder().encode("a + b * c")),
);
// result.status === "complete"
// result.root.expression is (+ a (* b c))
```

`root.expression` is a binary `CstExpression` tree with source-token and
group leaves. Each binary node retains its explicit or synthetic operator,
left/right children, and a half-open **original-byte** span from the left
child's start through the right child's end. A `CstParsedGroup` keeps its
original delimiters and contains an independently parsed scope. Every scope
also retains its original `CstSequence` in `structure`, including ordered
comments, whitespace, BOM trivia, and error entries; tree spans may therefore
cover trivia that is stored in this structural sequence rather than attached
to a child.

The exported `OPERATOR_PRECEDENCE` table implements all DEC-022 levels and
DEC-066 associativities; lower numeric priorities bind more tightly. An
iterative shunting-yard reduction is used instead of recursive operator
descent, so long operator chains do not consume the call stack. A separate
post-order stack parses nested groups. Same-level left operators reduce as
they arrive, right-associative operators remain stacked, and a repeated
non-associative level receives a `non-associative-operator-chain` error.
For that rejected chain, the parser retains a deterministic left-reduced
partial tree; `status` is `"error"`, never `"complete"`.

All operands and operators remain generic. There are no keyword productions,
unary-specific rules, conditional reassociation, or semantic checks.
`::` is accepted at `:`'s right-associative level; its reserved status and
operand legality are semantic work. Prefix/postfix-looking source uses the
same binary rules and the structure phase's synthetic `EMPTY` nodes, e.g.
`a * -b` groups as `(a * EMPTY) - b`, not as multiplication by a special
unary-minus expression.

Malformed input is not reported as successful. Lexer, delimiter, and
precedence errors set `status` to `"error"` while retaining diagnostics, the
full tree, and structural source. Missing closers are retained as zero-width
EOF insertions with diagnostics; their enclosing group still has a tree.

### Integrated recovery and reconstruction (Phase 8)

Pipeline: bytes, then `processSource` (UTF-8 + global escapes, byte provenance),
`lexCore`, `structureCore` (groups, error collapse/roles, `APPLY`/`EMPTY`) and
`parseCore` (precedence). `parseSource(input)` is the byte-to-CST entry point and
`reconstructSource(result, input)` returns the original bytes.

**Error collapse (DEC-079/087).** Within one scope, a maximal run of error units
(fallback regions, malformed-Unicode error characters, invalid numbers/literals,
touching runs, unexpected closers) becomes one `CstError`, even when whitespace
or comments separate the units. A token, group or opener ends the run. The
error owns, in `components`, each original `CstErrorPart` (unmodified lexer
token/region and `errorKind`) and the trivia between parts; trivia before the
first or after the last part stays at scope level. Unicode error characters
remain separate lexical units and only collapse here. Inside comments and
literals they are diagnosed only and never become errors. Diagnostics are not
merged: every constituent keeps its own diagnostic and byte location.

**Role selection (DEC-092/068).** A lexically designated operand error—such as
an invalid numeric candidate, malformed literal, or touching-operand run
(DEC-077/083)—retains its operand role. After collapse, any run containing one
of these parts is an operand, including a mixed run with fallback errors or
unexpected closers. Thus `a 0x b` and `a 0x § b` both retain the error as an
operand and need two `APPLY` operators. This lexical role constraint applies
even where classifying the run as an operator would need zero insertions.

For a collapsed run without a designated operand part, DEC-068 counts the
insertions needed for each role: as operand, one per operand neighbor; as
operator, one per operator neighbor. Scope start and end count as operator
neighbors, so a leading or trailing operator requires an `EMPTY`. The cheaper
role wins; ties choose operand. Because collapse prevents error runs from
neighboring one another, these fallback-only choices are independent and
minimize insertions subject to DEC-092's fixed-role constraint. For example,
the fallback-only run in `a § b` is an operator and needs no insertion.

**Binding (DEC-086).** An operator-classified error is a `CstErrorOperator`
with `ERROR_OPERATOR_PRECEDENCE` (priority -1, left): `a E b + c` is
`(a E b) + c` and `@x E y` is `@(x E y)`. An operand-classified error is a
`CstErrorOperand` leaf.

**Reconstruction.** `reconstructSource` iteratively walks the ordered `structure`
entries (trivia, tokens, error parts and trivia, group delimiters), copying each
range from the `SourceInput`. It throws if entries leave a gap, overlap or end
before EOF, so malformed bytes, BOM and escape spellings come from original
provenance, not decoded text.

**Complexity.** Collapse, role selection and insertion are linear passes per
scope; tree reduction and reconstruction are linear and use explicit stacks, so
long error runs, long chains and deep nesting do not recurse.

**Migration from Phase 6/7.** `CstError` now has `errorRole: "operand" |
"operator"` and `components`; `source`, `errorKind` and the `unresolved` role
are gone (use the parts). `CstOperator` gained `CstErrorOperator`. Error-bearing
scopes now have an `expression` (previously `undefined`), but `status` stays
`"error"`. Adjacent errors are one entry, and an error no longer suppresses
`APPLY`/`EMPTY` insertion around it.

**Limits.** No semantic checks, AST or backend. Error recovery retains
diagnostics and a structural/expression tree but does not make malformed input
successful: any error diagnostic yields `status: "error"`. Synthetic spans
retain the selected Phase 6 zero-width anchors and do not invent source bytes.
Diagnostics inside NFC-normalized literals use original byte spans.

Numeric tokens expose frozen `numeric: CoreNumber` metadata with integer,
fraction, exponent, and suffix components retained as written; `suffixKey` is
ASCII lowercase. `base` is bounded, and no numeric value, large power, or
floating-point rounding is computed. Unmerged malformed candidates retain metadata and
produce an `invalid-number` diagnostic; touching runs produce a
`touching-operands` diagnostic. Suffix meanings and numeric type ranges are
semantic work. `spelling` retains prefixes, markers, and original case after
global translation, while byte ranges preserve the original source.

### Literal values and diagnostics (Phase 4)

Literal tokens expose frozen `literal: CoreLiteral` metadata: syntax `kind`
(`character`, `string`, `raw-string`), decoded `value`, `terminated`, `valid`,
and literal-only `diagnostics`. Their `spelling` remains translated but
unnormalized; ranges always cover original bytes, not normalized value offsets.
Malformed candidates use `tokenKind: "error"` and `errorRole: "operand"` for
the future parser. Embedded Unicode source errors alone do not invalidate or
split the literal: each contributes U+FFFD even when consumed while checking an
ordinary escape candidate. A malformed enclosing escape remains a separate
literal error and contributes its own replacement. Aggregate diagnostics retain
source errors, distinct from a valid literal U+FFFD.

All literal content uses pinned Unicode 18 NFC after global translation and
before ordinary escapes, never afterward. Ordinary escapes support quotes,
backslash, `a b e f n r t v`, selected ASCII `cX`, scalar `x{hex}`, and Unicode
18 names/official aliases in `N{name}` (ASCII case-insensitive, otherwise exact).
Unknown escapes, octal, `o{...}`, and numeric `N{U+...}` are errors. Character
values must contain exactly one scalar, not merely one grapheme.

Ordinary strings remove backslash + hard ending + following spaces/tabs;
characters cannot continue. Physical/generated endings, including mixed-origin
CRLF, behave identically. Interrupted ordinary candidates stop before the whole
ending, leaving it for subsequent scanning; unterminated raw candidates consume
through EOF. Raw openers require backtick + `[A-Za-z0-9_]*` + quote (unlimited
tag length); only quote + the identical tag + backtick closes them. A backtick
without that complete opener is unsupported, not an approximated raw candidate.
Raw non-universal backslashes are literal; hard endings normalize to LF.

**Internal diagnostic mapping (DEC-088):** The shared Unicode normalizer carries
exact input-scalar contributors through decomposition, canonical reordering,
and composition. Literal-escape diagnostics use the smallest original-byte
contiguous hull of those contributors. A reordered escape may therefore include
intervening bytes, but never an unrelated prefix/suffix or guessed normalized
index. Decomposition can give two output scalars the same original range.
Whole-literal errors use the candidate extent, excluding an interrupting ending.
These are diagnostic spans, not a public character-by-character value map.
Direct `scanCoreAt` exposes literal diagnostics in metadata; `lexCore` also
collects them into its byte-ordered diagnostics alongside source errors.

## Source processing and Unicode

`processSource(sourceInput)` returns translated `text`, immutable scalar
`units`, and source-processing `diagnostics` directly. It does not wrap output
with `CompilerResult`: malformed input must retain both its error diagnostics
and usable replacement-character output. Each `SourceUnit` records its
translated scalar, original half-open UTF-8 `byteRange`, original physical
`position` (one-based line and scalar column; a tab counts as one), origin
(`source`, `escape`, `invalid-utf8`, or `invalid-escape`), and error status.
`originalRange(start, end)` maps translated unit ranges back to original byte
ranges, including escape spellings and generated characters.

Only an initial UTF-8 BOM is omitted from translated text; its three bytes
remain counted in later offsets, and an interior BOM is retained. Invalid
UTF-8 follows maximal-subpart replacement. Global `\uXXXX` and `\UXXXXXXXX`
escapes use the approved Java-style backslash eligibility and are translated
once, with malformed/non-scalar escapes represented by diagnosed U+FFFD
units. Physical positions are computed from the original source, so generated
line breaks do not advance them: only original raw source line breaks affect
physical positions, and an original CRLF is one physical line ending.
Adjacent translated CR and LF are preserved regardless of their origins, for
the lexer to treat as one logical line ending.

Unicode behavior is pinned to `UNICODE_DATA_VERSION` (`18.0.0`), with
`assertUnicodeDataVersion` rejecting mismatches. The adapter exposes Unicode
18 XID properties and character names/official aliases through
`isXidStart`, `isXidContinue`, `getUnicodeName`,
`getUnicodeNameAliases`, and `findUnicodeCharacter`; name matching folds only
ASCII letter case. `@unicode/unicode-18.0.0` is pinned to 2.1.0 (MIT,
[project](https://github.com/node-unicode/unicode-18.0.0)); its data is for
Unicode 18.0.0 and originates from the Unicode Character Database. Its
published properties cover XID and `White_Space`, but it does not provide
normalization mappings. The installed Node.js v26.13.0 uses Unicode 17.0.0
(`process.versions.unicode`), so its host normalization APIs are not used.
Unicode 18 NFC/NFKC is implemented from generated, minimal tables derived
from the official `UnicodeData.txt` and `DerivedNormalizationProps.txt`:
5,982 decomposition mappings, 1,002 nonzero canonical combining classes, and
961 composition pairs (227,113 generated bytes). The generator is
`scripts/generate-unicode-normalization.mjs`; it validates SHA-256 values
before generation:

| Official Unicode 18.0.0 source  | SHA-256                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| `UnicodeData.txt`               | `0736451de439ae7baf1425136617da495e09ee5afbe6e394374db7009ea08950` |
| `DerivedNormalizationProps.txt` | `98ac7f67d985fe781e317f6182e885e94cabb0c314769e6dd73e48b226931ccd` |

These are official UCD files at
`https://www.unicode.org/Public/18.0.0/ucd/`. To reproduce the generated
tables, download those two files to one directory and run
`node scripts/generate-unicode-normalization.mjs <ucd-directory>`.
`tests/fixtures/NormalizationTest-18.0.0.txt` is the official Unicode
conformance fixture (2,863,708 bytes; SHA-256
`25a50d816764b04abfb4a646d3eb2b2a803284c3873d9a06757b94fe4513dde3`).
The test checks all 20,171 data rows, five input columns for each of NFC and
NFKC (201,710 normalization assertions). The fixture retains its official
Unicode copyright/license notice. Unicode data copyright and use terms are
at https://www.unicode.org/terms_of_use.html. The official versioned release
metadata and source data are published at
https://www.unicode.org/Public/18.0.0/ucd/ReadMe.txt, including the
18.0.0-tagged `DerivedCoreProperties.txt`, `NameAliases.txt`, and related
files. The adapter's Unicode-18-only U+0558 fixture is verified against
[`DerivedAge.txt`](https://www.unicode.org/Public/18.0.0/ucd/DerivedAge.txt)
(`0558 ; 18.0`), `DerivedCoreProperties.txt` (XID start/continue), and
[`UnicodeData.txt`](https://www.unicode.org/Public/18.0.0/ucd/UnicodeData.txt)
(`MODIFIER LETTER ARMENIAN SMALL EH`).
