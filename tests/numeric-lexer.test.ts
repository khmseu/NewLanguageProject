import { describe, expect, it } from "vitest";
import { lexCore, processSource, SourceInput } from "../src/index.js";
import { scanNumericAt } from "../src/lexer/numeric-scanner.js";

const encode = (text: string) => new TextEncoder().encode(text);
const lex = (text: string) => lexCore(new SourceInput(encode(text)));
const tokens = (text: string) => lex(text).items
  .filter((item) => item.kind !== "trivia")
  .map((item) => item.kind === "token"
    ? [item.tokenKind, item.spelling]
    : [item.kind, item.spelling]);

describe("numeric candidates DEC-028/033/047/057–061/089–091", () => {
  it("recognizes unified candidates before validation", () => {
    const source = processSource(new SourceInput(encode("0x1p+2")));
    expect(scanNumericAt(source, 0)).toMatchObject({ end: 6 });
  });

  it.each([
    "0", "012", "1_2", "0b10", "0O7", "0d16#ff", "0xFF",
    "2#10", "36#z#I32", "37#foo", "1#F64", "1.5#F64",
    "1.#F64", ".5#F64", "1e3#F64", "0x1p0#F64", "0x1.p0",
    "0x.8p0", "1e-2", "1_2.3_4e5_6",
  ])("accepts %s", (text) => {
    const result = lex(text);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({ kind: "token", tokenKind: "number", spelling: text });
    expect(result.diagnostics).toEqual([]);
  });

  it.each([
    "0x", "0b", "0o", "0d", "16#", "2#", "02#10", "036#z", "16#gg",
    "0b102", "1__2", "1_", "0x_1", "1._2", "1e_2", "16#_f",
    "1e+", "0x1p", "0x1.2", "0x.8", "0x#x", "1#F_64", "16##x",
    "123foo", "1.2foo", "1e3foo", "123é", "1.foo", "a.5",
    "1..2", "1.2.3", "1e2.3", "1e2e", "1fooE",
  ])("rejects all of %s as one error operand", (text) => {
    const result = lex(text);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({ kind: "token", tokenKind: "error", errorRole: "operand", spelling: text });
    expect(result.diagnostics.some((diagnostic) => diagnostic.severity === "error")).toBe(true);
  });

  it.each([
    ["1e++2", [["error", "1e+"], ["operator", "+"], ["number", "2"]]],
    ["16#1e+2", [["number", "16#1e"], ["operator", "+"], ["number", "2"]]],
    ["0x1p+2", [["number", "0x1p+2"]]],
    ["1e2e+3", [["error", "1e2e"], ["operator", "+"], ["number", "3"]]],
    ["1fooE+2", [["error", "1fooE"], ["operator", "+"], ["number", "2"]]],
    ["37#foo#bar", [["number", "37#foo"], ["unsupported", "#"], ["identifier", "bar"]]],
    ["16#ff#I32#x", [["number", "16#ff#I32"], ["unsupported", "#"], ["identifier", "x"]]],
    ["1...x", [["number", "1."], ["operator", "."], ["operator", "."], ["identifier", "x"]]],
    ["foo123", [["identifier", "foo123"]]],
  ])("preserves boundary %s", (text, expected) => {
    expect(tokens(text as string)).toEqual(expected);
  });

  it("retains arbitrary-length components without numeric conversion", () => {
    for (const text of [
      "9".repeat(3000), `1e${"9".repeat(3000)}`,
      `37#${"z".repeat(3000)}`, `${"9".repeat(3000)}#x`,
    ]) {
      expect(lex(text).items[0]).toMatchObject({ kind: "token", tokenKind: "number", spelling: text });
    }
    const invalidBase = `${"0".repeat(3000)}16#ff`;
    expect(lex(invalidBase).items[0]).toMatchObject({
      tokenKind: "error", spelling: invalidBase, numeric: { base: 16 },
    });
  });

  it("does not reopen an exponent after an invalid alphabetic tail across a point (DEC-091)", () => {
    expect(tokens("1f.2e+3")).toEqual([["error", "1f.2e"], ["operator", "+"], ["number", "3"]]);
    expect(tokens("0x1g.2p+3")).toEqual([["error", "0x1g.2p"], ["operator", "+"], ["number", "3"]]);
  });

  it("retains exact numeric components and a case-insensitive ASCII suffix key", () => {
    expect(lex("0xA_B.c_Dp-2_3#F64").items[0]).toMatchObject({
      tokenKind: "number", numeric: {
        kind: "float", base: 16, integer: "A_B", fraction: "c_D",
        exponent: "-2_3", suffix: "F64", suffixKey: "f64", valid: true,
      },
    });
  });

  it("respects suffix separators and underscore boundaries", () => {
    for (const text of ["0d1#", "1_#x", "16_#ff", "0d1#_x", "1#x_", "0x1p_2", "0x1_.0p0"]) {
      expect(lex(text).items[0]).toMatchObject({ tokenKind: "error", spelling: text });
    }
    expect(tokens("a/*c*/.5 1. foo")).toEqual([
      ["identifier", "a"], ["number", ".5"], ["number", "1."], ["identifier", "foo"],
    ]);
  });

  it("reports exact translated and byte extents for malformed candidates", () => {
    const result = lex("é 0x1.2 + 123é");
    const errors = result.items.filter((item) => item.kind === "token" && item.tokenKind === "error");
    expect(errors.map((item) => [item.spelling, item.range])).toEqual([
      ["0x1.2", { unitStart: 2, unitEnd: 7, bytes: { start: 3, end: 8 } }],
      ["123é", { unitStart: 10, unitEnd: 14, bytes: { start: 11, end: 16 } }],
    ]);
    expect(result.diagnostics.map(({ code, location }) => [code, location])).toEqual([
      ["invalid-number", { start: 3, end: 8 }],
      ["touching-operands", { start: 11, end: 16 }],
    ]);
  });

  it("keeps Unicode error units distinct from fallback runs and operands", () => {
    const result = lexCore(new SourceInput(Uint8Array.from([0x31, 0xff, 0xfe, 0x32, 0x20, 0x23, 0x24, 0x61])));
    expect(result.items.map((item) => [item.kind, item.spelling])).toEqual([
      ["token", "1"], ["unsupported", "�"], ["unsupported", "�"], ["token", "2"],
      ["trivia", " "], ["unsupported", "#$"], ["token", "a"],
    ]);
  });

  it("partitions bytes across BOM, escapes, malformed literals and comments", () => {
    const bytes = Uint8Array.from([
      0xef, 0xbb, 0xbf, ...encode(String.raw`1\u0032é "x\q" /*`), 0xff, 0x31,
    ]);
    const source = new SourceInput(bytes);
    const result = lexCore(source);
    expect(result.items[1]).toMatchObject({
      tokenKind: "error", spelling: "12é", range: { bytes: { start: 3, end: 12 } },
    });
    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual(expect.arrayContaining([
      "touching-operands", "invalid-literal-escape", "unterminated-block-comment", "invalid-utf8",
    ]));
    const reconstructed = result.items.flatMap((item) => [...source.slice(item.range.bytes)]);
    expect(reconstructed).toEqual([...bytes]);
  });

  it("makes progress and partitions original bytes on malformed input", () => {
    let seed = 42;
    for (let trial = 0; trial < 120; trial++) {
      const bytes = Uint8Array.from({ length: 60 }, () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed >>> 24;
      });
      const result = lexCore(new SourceInput(bytes));
      let end = 0;
      for (const item of result.items) {
        expect(item.range.bytes.start).toBe(end);
        end = item.range.bytes.end;
      }
      expect(end).toBe(bytes.length);
    }
  });
});
