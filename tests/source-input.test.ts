import { describe, expect, it } from "vitest";
import { SourceInput } from "../src/index.js";

describe("SourceInput", () => {
  it.each([
    { label: "undefined", input: undefined },
    { label: "null", input: null },
    { label: "number", input: 3 },
    { label: "string", input: "abc" },
    { label: "array", input: [1, 2, 3] },
    { label: "array-like object", input: { 0: 1, length: 1 } },
    { label: "ArrayBuffer", input: new ArrayBuffer(3) },
    { label: "DataView", input: new DataView(new ArrayBuffer(3)) },
    { label: "Uint16Array", input: new Uint16Array([0x1234]) },
    { label: "Int8Array", input: new Int8Array([-1]) },
    { label: "Uint8ClampedArray", input: new Uint8ClampedArray([255]) },
  ])("rejects unsupported constructor input: $label", ({ input }) => {
    expect(() => Reflect.construct(SourceInput, [input])).toThrow(TypeError);
  });

  it("preserves original bytes, including malformed UTF-8, and isolates mutations", () => {
    const original = new Uint8Array([0xef, 0xbf, 0xff, 0x80]);
    const source = new SourceInput(original);

    original[0] = 0x00;
    expect(source.bytes).toEqual(new Uint8Array([0xef, 0xbf, 0xff, 0x80]));
    expect(source.byteLength).toBe(4);

    const exposed = source.bytes;
    exposed[1] = 0x00;
    expect(source.bytes).toEqual(new Uint8Array([0xef, 0xbf, 0xff, 0x80]));
  });

  it("returns copied half-open byte slices", () => {
    const source = new SourceInput(new Uint8Array([0x61, 0xff, 0x62]));

    const middle = source.slice(source.range(1, 2));
    expect(source.slice(source.range(0, 3))).toEqual(
      new Uint8Array([0x61, 0xff, 0x62]),
    );
    expect(middle).toEqual(new Uint8Array([0xff]));
    expect(source.slice(source.range(1, 1))).toEqual(new Uint8Array());
    expect(Object.isFrozen(source.range(1, 2))).toBe(true);

    middle[0] = 0x00;
    expect(source.slice(source.range(1, 2))).toEqual(new Uint8Array([0xff]));
  });

  it.each([
    [-1, 0],
    [0, -1],
    [2, 1],
    [0, 4],
    [0.5, 1],
    [0, Number.NaN],
    [0, Number.POSITIVE_INFINITY],
  ])("rejects invalid byte range [%s, %s)", (start, end) => {
    const source = new SourceInput(new Uint8Array([1, 2, 3]));
    expect(() => source.range(start, end)).toThrow(RangeError);
  });

  it("validates externally constructed ranges before slicing", () => {
    const source = new SourceInput(new Uint8Array([1, 2, 3]));

    expect(source.slice({ start: 1, end: 3 })).toEqual(new Uint8Array([2, 3]));
    expect(() => source.slice({ start: 0, end: 4 })).toThrow(RangeError);
  });

  it.each([
    { label: "undefined", range: undefined },
    { label: "null", range: null },
    { label: "number", range: 1 },
    { label: "string", range: "0,1" },
    { label: "boolean", range: true },
    { label: "symbol", range: Symbol("range") },
    { label: "bigint", range: 1n },
    { label: "empty object", range: {} },
    { label: "array", range: [0, 1] },
    { label: "missing start", range: { end: 1 } },
    { label: "missing end", range: { start: 0 } },
    { label: "undefined start", range: { start: undefined, end: 1 } },
    { label: "null end", range: { start: 0, end: null } },
    { label: "string start", range: { start: "0", end: 1 } },
    { label: "symbol end", range: { start: 0, end: Symbol("end") } },
    { label: "object end", range: { start: 0, end: { toString: null } } },
    { label: "negative start", range: { start: -1, end: 1 } },
    { label: "negative end", range: { start: 0, end: -1 } },
    { label: "reversed offsets", range: { start: 2, end: 1 } },
    { label: "out-of-bounds start", range: { start: 4, end: 4 } },
    { label: "out-of-bounds end", range: { start: 0, end: 4 } },
    { label: "fractional start", range: { start: 0.5, end: 1 } },
    { label: "fractional end", range: { start: 0, end: 1.5 } },
    { label: "NaN start", range: { start: Number.NaN, end: 1 } },
    { label: "NaN end", range: { start: 0, end: Number.NaN } },
    {
      label: "infinite end",
      range: { start: 0, end: Number.POSITIVE_INFINITY },
    },
  ])("rejects invalid external range: $label", ({ range }) => {
    const source = new SourceInput(new Uint8Array([1, 2, 3]));

    expect(() => Reflect.apply(source.slice, source, [range])).toThrow(
      RangeError,
    );
  });
});
