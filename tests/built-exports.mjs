import assert from "node:assert/strict";
import {
  SourceInput,
  UNICODE_DATA_VERSION,
  processSource,
} from "new-language-compiler-frontend";

const source = new SourceInput(new Uint8Array([0xff]));
assert.equal(SourceInput.name, "SourceInput");
assert.deepEqual(source.slice(source.range(0, 1)), new Uint8Array([0xff]));
assert.equal(UNICODE_DATA_VERSION, "18.0.0");
assert.equal(processSource(source).text, "\uFFFD");
