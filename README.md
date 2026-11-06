# New Language compiler frontend foundation

This is a strict TypeScript ESM package for the compiler frontend foundation.
It provides original-byte source input, source decoding and Unicode
translation, a Unicode-18-pinned core scanner and lossless token/trivia stream,
diagnostic types, and a generic result contract. Parser construction and
language-specific numeric/literal recognition remain deferred.

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
identifiers, the approved source-operator inventory (longest match), and
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

`scanCoreAt(processedSource, unitOffset)` supports composition with later
scanners. Numeric and literal starts return one-unit `deferred` boundaries,
not approximated tokens or language errors. `lexCore` stops core scanning at
such a start, returns the remaining bytes as a deferred item with
`coverage: "unscanned-suffix"`, and reports `status: "deferred"` (or
`"deferred-and-unsupported"` if earlier unknown characters occurred). Unknown
characters are explicit unsupported items with `unrecognized-character`
diagnostics. `status` reports scanner coverage, not compiler success; inspect
diagnostics independently. Numeric syntax, literal syntax, parser errors,
and error collapse are not implemented.

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

| Official Unicode 18.0.0 source | SHA-256 |
| --- | --- |
| `UnicodeData.txt` | `0736451de439ae7baf1425136617da495e09ee5afbe6e394374db7009ea08950` |
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
