import assert from "node:assert/strict";
import {
  lexCore,
  normalizeUnicode18,
  scanCoreAt,
  SourceInput,
  UNICODE_DATA_VERSION,
  processSource,
} from "new-language-compiler-frontend";

const source = new SourceInput(new Uint8Array([0xff]));
assert.equal(SourceInput.name, "SourceInput");
assert.deepEqual(source.slice(source.range(0, 1)), new Uint8Array([0xff]));
assert.equal(UNICODE_DATA_VERSION, "18.0.0");
assert.equal(processSource(source).text, "\uFFFD");
assert.equal(normalizeUnicode18("e\u0301", "NFC"), "é");
const lexicalSource = new SourceInput(new TextEncoder().encode("e\u0301 + 1"));
const lexical = lexCore(lexicalSource);
assert.equal(lexical.status, "deferred");
assert.deepEqual(
  lexical.items.slice(0, 3).map((item) =>
    item.kind === "token" ? [item.tokenKind, item.spelling] : item.triviaKind,
  ),
  [["identifier", "e\u0301"], "whitespace", ["operator", "+"]],
);
assert.equal(scanCoreAt(lexical.source, 5).kind, "deferred");
