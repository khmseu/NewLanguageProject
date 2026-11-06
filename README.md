# New Language compiler frontend foundation

This is a strict TypeScript ESM package for the compiler frontend foundation.
It currently provides original-byte source input, diagnostic types, and a
generic result contract; decoding, Unicode processing, lexing, parsing, and
language-specific behavior are intentionally not implemented here.

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
`bytes` getter and `slice()` method return
copies, so callers cannot mutate retained source data. The class does not
decode UTF-8: malformed byte sequences are preserved exactly for later
diagnostics and reconstruction.

`ByteRange` follows DEC-036's zero-based, half-open byte offsets `[start, end)`
into those original bytes. `SourceInput.range(start, end)` and `slice(range)`
validate that both offsets are integers and
`0 <= start <= end <= byteLength`; invalid programmer-supplied ranges throw
`RangeError`, including null, undefined, malformed range objects, and nonnumeric
offsets passed to `slice()`. Ranges returned by `range()` are immutable. The
diagnostics' `SourceLocation` is this same byte-range shape; line/column
calculation is deferred to source decoding and does not happen in this foundation.

`Diagnostic` carries a caller-selected string `code`, an `error`, `warning`,
or `info` severity, a message, and an original-byte `SourceLocation`.
`CompilerResult<T, D>` is a discriminated union: successful results contain
only warnings/information diagnostics, while failed results require at least
one error diagnostic. In TypeScript, provide failed diagnostics as a non-empty
tuple (commonly `[error] as const`) so the required error remains represented
in the type. The generic `D` can narrow the diagnostics used by a compiler
operation.
