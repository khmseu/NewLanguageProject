import assert from "node:assert/strict";
import {
  lexCore,
  parseSource,
  reconstructSource,
  ERROR_OPERATOR_PRECEDENCE,
  OPERATOR_PRECEDENCE,
  normalizeUnicode18,
  scanCoreAt,
  structureCore,
  SourceInput,
  UNICODE_DATA_VERSION,
  processSource,
} from "new-language-compiler-frontend";

const source = new SourceInput(new Uint8Array([0xff]));
assert.equal(SourceInput.name, "SourceInput");
assert.equal(typeof parseSource, "function");
assert.equal(OPERATOR_PRECEDENCE["**"].associativity, "right");
assert.equal(
  parseSource(new SourceInput(new TextEncoder().encode("a + b"))).status,
  "complete",
);
assert.deepEqual(source.slice(source.range(0, 1)), new Uint8Array([0xff]));
assert.equal(UNICODE_DATA_VERSION, "18.0.0");
assert.equal(processSource(source).text, "\uFFFD");
assert.equal(normalizeUnicode18("e\u0301", "NFC"), "é");
const lexicalSource = new SourceInput(new TextEncoder().encode("e\u0301 + 1"));
const lexical = lexCore(lexicalSource);
assert.equal(lexical.status, "complete");
assert.deepEqual(
  lexical.items
    .slice(0, 3)
    .map((item) =>
      item.kind === "token" ? [item.tokenKind, item.spelling] : item.triviaKind,
    ),
  [["identifier", "e\u0301"], "whitespace", ["operator", "+"]],
);
assert.equal(scanCoreAt(lexical.source, 5).tokenKind, "number");
const structure = structureCore(
  lexCore(new SourceInput(new TextEncoder().encode("a b"))),
);
assert.deepEqual(
  structure.root.entries
    .map((entry) =>
      entry.kind === "trivia"
        ? undefined
        : entry.kind === "operand" && entry.operandKind === "token"
          ? entry.token.spelling
          : entry.kind === "operator"
            ? entry.spelling
            : entry.kind,
    )
    .filter((entry) => entry !== undefined),
  ["a", "APPLY", "b"],
);
const numeric = lexCore(
  new SourceInput(new TextEncoder().encode("0x1p+2#F64")),
);
assert.equal(numeric.items[0].numeric.suffixKey, "f64");
assert.equal(numeric.items[0].numeric.exponent, "+2");
assert.deepEqual(numeric.diagnostics, []);
const literals = lexCore(
  new SourceInput(
    new TextEncoder().encode(
      String.raw`'e\u0301' "e\x{301}" ` + '`T"raw\\n"T` "\\q"',
    ),
  ),
);
assert.equal(literals.status, "complete");
assert.deepEqual(
  literals.items
    .filter((item) => item.kind === "token")
    .map((item) => [item.tokenKind, item.literal.value, item.errorRole]),
  [
    ["character", "é", undefined],
    ["string", "e\u0301", undefined],
    ["raw-string", "raw\\n", undefined],
    ["error", "\ufffd", "operand"],
  ],
);
assert.equal(literals.diagnostics[0].code, "invalid-literal-escape");

const recovered = new SourceInput(new TextEncoder().encode("a /*c*/ § § b"));
const recoveredResult = parseSource(recovered);
assert.equal(recoveredResult.status, "error");
assert.equal(recoveredResult.root.expression.operator.operatorKind, "error");
assert.equal(ERROR_OPERATOR_PRECEDENCE.priority, -1);
assert.deepEqual(
  reconstructSource(recoveredResult, recovered),
  recovered.bytes,
);
