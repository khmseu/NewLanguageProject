# New Language compiler frontend foundation

This is a strict TypeScript ESM package for the compiler frontend foundation.
It provides original-byte source input, source decoding and Unicode
translation, version-pinned Unicode property/name access, diagnostic types,
and a generic result contract. Lexing, parsing, and language-specific behavior
are intentionally not implemented here.

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
Unicode 18.0.0 and originates from the Unicode Character Database. Unicode
data copyright and use terms are at
https://www.unicode.org/terms_of_use.html. The official versioned release
metadata and source data are published at
https://www.unicode.org/Public/18.0.0/ucd/ReadMe.txt, including the
18.0.0-tagged `DerivedCoreProperties.txt`, `NameAliases.txt`,
`NormalizationTest.txt`, and related normalization files. The adapter's
Unicode-18-only U+0558 fixture is verified against
[`DerivedAge.txt`](https://www.unicode.org/Public/18.0.0/ucd/DerivedAge.txt)
(`0558 ; 18.0`), `DerivedCoreProperties.txt` (XID start/continue), and
[`UnicodeData.txt`](https://www.unicode.org/Public/18.0.0/ucd/UnicodeData.txt)
(`MODIFIER LETTER ARMENIAN SMALL EH`).
Unicode 18 normalization implementation, including identifier/literal
normalization, remains deferred; the current adapter supplies XID and
names/aliases only. Future normalization must use Unicode 18 data rather
than the host runtime's unversioned normalization behavior.
