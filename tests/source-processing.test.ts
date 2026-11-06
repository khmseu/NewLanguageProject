import { describe, expect, it } from "vitest";
import {
  UNICODE_DATA_VERSION,
  SourceInput,
  assertUnicodeDataVersion,
  findUnicodeCharacter,
  getUnicodeName,
  getUnicodeNameAliases,
  isXidContinue,
  isXidStart,
  processSource,
} from "../src/index.js";

function processBytes(bytes: Uint8Array) {
  return processSource(new SourceInput(bytes));
}

describe("Unicode 18 data adapter", () => {
  it("pins and checks the data version instead of using host Unicode behavior", () => {
    expect(UNICODE_DATA_VERSION).toBe("18.0.0");
    expect(() => assertUnicodeDataVersion("18.0.0")).not.toThrow();
    expect(() => assertUnicodeDataVersion("17.0.0")).toThrow(/18\.0\.0/);
    expect(isXidStart(0x10400)).toBe(true);
    expect(isXidStart(0x0030)).toBe(false);
    expect(isXidContinue(0x005f)).toBe(true);
  });

  it("provides Unicode names and official aliases with ASCII-only case folding", () => {
    expect(getUnicodeName(0x0041)).toBe("LATIN CAPITAL LETTER A");
    expect(findUnicodeCharacter("latin capital letter a")).toBe(0x0041);
    expect(findUnicodeCharacter("null")).toBe(0x0000);
    expect(getUnicodeNameAliases(0x0000)).toContain("NULL");
    expect(findUnicodeCharacter("LATIN  CAPITAL LETTER A")).toBeUndefined();
  });

  it("uses Unicode-18-only XID and name data (DEC-078/082)", () => {
    // https://www.unicode.org/Public/18.0.0/ucd/DerivedAge.txt
    // # DerivedAge-18.0.0.txt: 0558 ; 18.0
    // https://www.unicode.org/Public/18.0.0/ucd/DerivedCoreProperties.txt
    // # DerivedCoreProperties-18.0.0.txt: 0558..0559 ; XID_Start / XID_Continue
    // https://www.unicode.org/Public/18.0.0/ucd/UnicodeData.txt
    // 0558;MODIFIER LETTER ARMENIAN SMALL EH;Lm;...
    expect(isXidStart(0x0558)).toBe(true);
    expect(isXidContinue(0x0558)).toBe(true);
    expect(getUnicodeName(0x0558)).toBe("MODIFIER LETTER ARMENIAN SMALL EH");
    expect(findUnicodeCharacter("modifier letter armenian small eh")).toBe(
      0x0558,
    );
  });
});

describe("processSource", () => {
  it("distinguishes literal, invalid-UTF-8, and escaped U+FFFD (DEC-078/082)", () => {
    const sources = [
      new TextEncoder().encode("\uFFFD"),
      new Uint8Array([0xff]),
      new TextEncoder().encode(String.raw`\uFFFD`),
    ];
    const results = sources.map(processBytes);

    expect(results.map((result) => result.text)).toEqual([
      "\uFFFD",
      "\uFFFD",
      "\uFFFD",
    ]);
    expect(results.map((result) => result.units[0])).toEqual(
      [
        { origin: "source", isError: false, end: 3 },
        { origin: "invalid-utf8", isError: true, end: 1 },
        { origin: "escape", isError: false, end: 6 },
      ].map(({ origin, isError, end }) => ({
        character: "\uFFFD",
        codePoint: 0xfffd,
        byteRange: { start: 0, end },
        position: { line: 1, column: 1 },
        origin,
        isError,
      })),
    );
    expect(results.map((result) => result.diagnostics)).toEqual([
      [],
      [
        {
          code: "invalid-utf8",
          severity: "error",
          message: expect.any(String),
          location: { start: 0, end: 1 },
          position: { line: 1, column: 1 },
        },
      ],
      [],
    ]);
    results.forEach((result, index) => {
      const input = new SourceInput(sources[index]!);
      expect(input.slice(result.originalRange(0, 1))).toEqual(sources[index]);
    });
  });

  it.each([
    { label: "empty", bytes: [], offset: 0 },
    { label: "BOM-only", bytes: [0xef, 0xbb, 0xbf], offset: 3 },
  ])("maps the empty $label source range (DEC-036)", ({ bytes, offset }) => {
    const result = processBytes(new Uint8Array(bytes));
    expect(result.text).toBe("");
    expect(result.units).toEqual([]);
    expect(result.diagnostics).toEqual([]);
    expect(result.originalRange(0, 0)).toEqual({ start: offset, end: offset });
  });

  it.each([
    [-1, 0],
    [1, 0],
    [0, 2],
    [2, 2],
    [0.5, 1],
    [0, 0.5],
    [NaN, 1],
    [0, NaN],
    [Infinity, Infinity],
    [0, Infinity],
  ])(
    "rejects invalid translated-unit range [%s, %s) (DEC-036)",
    (start, end) => {
      const result = processBytes(new TextEncoder().encode("a"));
      expect(() => result.originalRange(start, end)).toThrow(RangeError);
    },
  );

  it.each([
    { label: "truncated two-byte", bytes: [0xc2], spans: [[0, 1]] },
    { label: "truncated three-byte", bytes: [0xe2, 0x82], spans: [[0, 2]] },
    {
      label: "truncated four-byte",
      bytes: [0xf0, 0x9f, 0x98],
      spans: [[0, 3]],
    },
    {
      label: "overlong two-byte",
      bytes: [0xc0, 0xaf],
      spans: [
        [0, 1],
        [1, 2],
      ],
    },
    {
      label: "overlong three-byte",
      bytes: [0xe0, 0x80, 0xaf],
      spans: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },
    {
      label: "overlong four-byte",
      bytes: [0xf0, 0x80, 0x80, 0xaf],
      spans: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
      ],
    },
    {
      label: "surrogate",
      bytes: [0xed, 0xa0, 0x80],
      spans: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },
    {
      label: "above maximum scalar",
      bytes: [0xf4, 0x90, 0x80, 0x80],
      spans: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
      ],
    },
    {
      label: "out-of-range lead",
      bytes: [0xf5, 0x80, 0x80, 0x80],
      spans: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
      ],
    },
    {
      label: "isolated continuation bytes",
      bytes: [0x80, 0xbf],
      spans: [
        [0, 1],
        [1, 2],
      ],
    },
  ])(
    "recovers $label UTF-8 by maximal subparts (DEC-078)",
    ({ bytes, spans }) => {
      const input = new SourceInput(new Uint8Array(bytes));
      const result = processSource(input);
      expect(result.text).toBe("\uFFFD".repeat(spans.length));
      expect(result.units).toEqual(
        spans.map(([start, end], index) => ({
          character: "\uFFFD",
          codePoint: 0xfffd,
          byteRange: { start, end },
          position: { line: 1, column: index + 1 },
          origin: "invalid-utf8",
          isError: true,
        })),
      );
      expect(result.diagnostics).toEqual(
        spans.map(([start, end], index) => ({
          code: "invalid-utf8",
          severity: "error",
          message: expect.any(String),
          location: { start, end },
          position: { line: 1, column: index + 1 },
        })),
      );
      expect(input.slice(result.originalRange(0, result.units.length))).toEqual(
        new Uint8Array(bytes),
      );
    },
  );

  it("accepts the maximum legal UTF-8 scalar (DEC-078)", () => {
    const result = processBytes(new Uint8Array([0xf4, 0x8f, 0xbf, 0xbf]));
    expect(result.text).toBe("\u{10FFFF}");
    expect(result.units).toEqual([
      {
        character: "\u{10FFFF}",
        codePoint: 0x10ffff,
        byteRange: { start: 0, end: 4 },
        position: { line: 1, column: 1 },
        origin: "source",
        isError: false,
      },
    ]);
    expect(result.diagnostics).toEqual([]);
  });

  it.each([
    {
      text: "a\r",
      positions: [
        [1, 1],
        [1, 2],
      ],
    },
    {
      text: "a\r\r\nb",
      positions: [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
        [3, 1],
      ],
    },
  ])(
    "retains physical positions in $text (DEC-036/078)",
    ({ text, positions }) => {
      const result = processBytes(new TextEncoder().encode(text));
      expect(result.text).toBe(text);
      expect(
        result.units.map((unit) => [unit.position.line, unit.position.column]),
      ).toEqual(positions);
      expect(result.units.map((unit) => unit.byteRange)).toEqual(
        [...text].map((_, index) => ({ start: index, end: index + 1 })),
      );
      expect(result.diagnostics).toEqual([]);
    },
  );

  it.each([3, 4, 5, 6])(
    "applies eligibility to %s raw backslashes (DEC-082)",
    (count) => {
      const result = processBytes(
        new TextEncoder().encode("\\".repeat(count) + "u0041"),
      );
      const translates = count % 2 === 1;
      expect(result.text).toBe(
        translates
          ? "\\".repeat(count - 1) + "A"
          : "\\".repeat(count) + "u0041",
      );
      expect(
        result.units
          .filter((unit) => unit.origin === "escape")
          .map((unit) => unit.byteRange),
      ).toEqual(translates ? [{ start: count - 1, end: count + 5 }] : []);
      expect(result.units.every((unit) => !unit.isError)).toBe(true);
      expect(result.diagnostics).toEqual([]);
    },
  );

  it.each([
    {
      source: String.raw`\u005C\\u0041`,
      text: "\\\\A",
      origins: ["escape", "source", "escape"],
    },
    {
      source: String.raw`\u0041\\u0042`,
      text: String.raw`A\\u0042`,
      origins: ["escape", ...Array<string>(7).fill("source")],
    },
  ])(
    "handles escape output before a raw pair: $source (DEC-082)",
    ({ source, text, origins }) => {
      const result = processBytes(new TextEncoder().encode(source));
      expect(result.text).toBe(text);
      expect(result.units.map((unit) => unit.origin)).toEqual(origins);
      expect(result.originalRange(0, result.units.length)).toEqual({
        start: 0,
        end: source.length,
      });
      expect(result.diagnostics).toEqual([]);
    },
  );

  it("retains UTF-8 diagnostics inside a malformed escape's selected extent (DEC-078/082)", () => {
    const input = new SourceInput(
      new Uint8Array([0x5c, 0x75, 0xe2, 0x82, 0x31, 0x32, 0x33, 0x34]),
    );
    const result = processSource(input);

    // The malformed UTF-8 maximal subpart counts as one decoded scalar.
    // The selected policy consumes four scalars after \u, not four bytes.
    expect(result.text).toBe("\uFFFD4");
    expect(result.units).toEqual([
      {
        character: "\uFFFD",
        codePoint: 0xfffd,
        byteRange: { start: 0, end: 7 },
        position: { line: 1, column: 1 },
        origin: "invalid-escape",
        isError: true,
      },
      {
        character: "4",
        codePoint: 0x34,
        byteRange: { start: 7, end: 8 },
        position: { line: 1, column: 7 },
        origin: "source",
        isError: false,
      },
    ]);
    expect(result.diagnostics).toEqual([
      {
        code: "invalid-unicode-escape",
        severity: "error",
        message: expect.any(String),
        location: { start: 0, end: 7 },
        position: { line: 1, column: 1 },
      },
      {
        code: "invalid-utf8",
        severity: "error",
        message: expect.any(String),
        location: { start: 2, end: 4 },
        position: { line: 1, column: 3 },
      },
    ]);
    expect(result.originalRange(0, 1)).toEqual({ start: 0, end: 7 });
    expect(input.slice(result.originalRange(0, 1))).toEqual(
      new Uint8Array([0x5c, 0x75, 0xe2, 0x82, 0x31, 0x32, 0x33]),
    );
  });

  it("ignores only the initial BOM while preserving byte offsets and scalar columns", () => {
    const result = processBytes(new TextEncoder().encode("\uFEFFA😀\tZ\uFEFF"));

    expect(result.text).toBe("A😀\tZ\uFEFF");
    expect(
      result.units.map((unit) => [unit.character, unit.byteRange]),
    ).toEqual([
      ["A", { start: 3, end: 4 }],
      ["😀", { start: 4, end: 8 }],
      ["\t", { start: 8, end: 9 }],
      ["Z", { start: 9, end: 10 }],
      ["\uFEFF", { start: 10, end: 13 }],
    ]);
    expect(result.units.map((unit) => unit.position)).toEqual([
      { line: 1, column: 1 },
      { line: 1, column: 2 },
      { line: 1, column: 3 },
      { line: 1, column: 4 },
      { line: 1, column: 5 },
    ]);
    expect(result.originalRange(0, 2)).toEqual({ start: 3, end: 8 });
    expect(result.originalRange(0, 0)).toEqual({ start: 3, end: 3 });
  });

  it("tracks all physical hard breaks and treats CRLF as one line ending", () => {
    const result = processBytes(
      new TextEncoder().encode("a\r\nb\rc\u0085d\u000be\u000cf\u2028g\u2029h"),
    );

    expect(
      result.units
        .filter((unit) => unit.character === "\r")
        .map((unit) => unit.position),
    ).toEqual([
      { line: 1, column: 2 },
      { line: 2, column: 2 },
    ]);
    expect(
      result.units
        .filter((unit) => unit.character === "\n")
        .map((unit) => unit.position),
    ).toEqual([{ line: 1, column: 3 }]);
    expect(
      result.units
        .filter((unit) =>
          ["b", "c", "d", "e", "f", "g", "h"].includes(unit.character),
        )
        .map((unit) => unit.position),
    ).toEqual([
      { line: 2, column: 1 },
      { line: 3, column: 1 },
      { line: 4, column: 1 },
      { line: 5, column: 1 },
      { line: 6, column: 1 },
      { line: 7, column: 1 },
      { line: 8, column: 1 },
    ]);
  });

  it("replaces malformed UTF-8 by maximal subparts with exact original byte spans", () => {
    const bytes = new Uint8Array([
      0xe2, 0x82, 0x62, 0xf0, 0x80, 0x80, 0x61, 0xf0, 0x9f, 0x98,
    ]);
    const result = processBytes(bytes);

    expect(result.text).toBe("\uFFFDb\uFFFD\uFFFD\uFFFDa\uFFFD");
    expect(
      result.units.map((unit) => [
        unit.character,
        unit.byteRange,
        unit.isError,
      ]),
    ).toEqual([
      ["\uFFFD", { start: 0, end: 2 }, true],
      ["b", { start: 2, end: 3 }, false],
      ["\uFFFD", { start: 3, end: 4 }, true],
      ["\uFFFD", { start: 4, end: 5 }, true],
      ["\uFFFD", { start: 5, end: 6 }, true],
      ["a", { start: 6, end: 7 }, false],
      ["\uFFFD", { start: 7, end: 10 }, true],
    ]);
    expect(
      result.diagnostics.map(({ code, location }) => [code, location]),
    ).toEqual([
      ["invalid-utf8", { start: 0, end: 2 }],
      ["invalid-utf8", { start: 3, end: 4 }],
      ["invalid-utf8", { start: 4, end: 5 }],
      ["invalid-utf8", { start: 5, end: 6 }],
      ["invalid-utf8", { start: 7, end: 10 }],
    ]);
  });

  it("translates eligible global escapes once and records their complete provenance", () => {
    const result = processBytes(
      new TextEncoder().encode(String.raw`a\u0041\U0001F600\u005Cu0041`),
    );

    expect(result.text).toBe("aA😀\\u0041");
    expect(result.diagnostics).toEqual([]);
    expect(result.units[1]).toMatchObject({
      character: "A",
      byteRange: { start: 1, end: 7 },
      position: { line: 1, column: 2 },
      origin: "escape",
      isError: false,
    });
    expect(result.units[2]).toMatchObject({
      character: "😀",
      byteRange: { start: 7, end: 17 },
      position: { line: 1, column: 8 },
      origin: "escape",
      isError: false,
    });
  });

  it("applies even-backslash eligibility, generated-backslash eligibility, and no retranslation", () => {
    const result = processBytes(
      new TextEncoder().encode(String.raw`\\u0041|\u005C\u0041|\u005Cu0041`),
    );

    expect(result.text).toBe(String.raw`\\u0041|\A|\u0041`);
    expect(result.diagnostics).toEqual([]);
  });

  it("diagnoses malformed and non-scalar escapes as one error character each", () => {
    const result = processBytes(
      new TextEncoder().encode(String.raw`\u12Q4 \U00110000 \uD800 \u123`),
    );

    expect(result.text).toBe("\uFFFD \uFFFD \uFFFD \uFFFD");
    expect(
      result.units.filter((unit) => unit.isError).map((unit) => unit.byteRange),
    ).toEqual([
      { start: 0, end: 6 },
      { start: 7, end: 17 },
      { start: 18, end: 24 },
      { start: 25, end: 30 },
    ]);
    expect(result.diagnostics).toHaveLength(4);
    expect(
      result.diagnostics.every((diagnostic) => diagnostic.position.line === 1),
    ).toBe(true);
  });

  it("does not combine adjacent surrogate escapes into a supplementary scalar", () => {
    const result = processBytes(
      new TextEncoder().encode(String.raw`\uD83D\uDE00`),
    );

    expect(result.text).toBe("\uFFFD\uFFFD");
    expect(result.units.map((unit) => unit.byteRange)).toEqual([
      { start: 0, end: 6 },
      { start: 6, end: 12 },
    ]);
    expect(result.diagnostics).toHaveLength(2);
  });

  it("retains generated line breaks and mixed-origin CRLF without changing physical lines", () => {
    const result = processBytes(new TextEncoder().encode("a\\u000D\nb"));

    expect(result.text).toBe("a\r\nb");
    expect(
      result.units
        .slice(1, 3)
        .map((unit) => [unit.character, unit.origin, unit.byteRange]),
    ).toEqual([
      ["\r", "escape", { start: 1, end: 7 }],
      ["\n", "source", { start: 7, end: 8 }],
    ]);
    expect(result.units[3]).toMatchObject({
      character: "b",
      position: { line: 2, column: 1 },
    });

    const generatedOnly = processBytes(
      new TextEncoder().encode(String.raw`a\u000D\u000Ab`),
    );
    expect(generatedOnly.text).toBe("a\r\nb");
    expect(generatedOnly.units[3]?.position).toEqual({ line: 1, column: 14 });

    const rawCr = processBytes(new TextEncoder().encode("a\r\\u000Ab"));
    expect(rawCr.text).toBe("a\r\nb");
    expect(
      rawCr.units
        .slice(1)
        .map((unit) => [
          unit.character,
          unit.origin,
          unit.byteRange,
          unit.position,
        ]),
    ).toEqual([
      ["\r", "source", { start: 1, end: 2 }, { line: 1, column: 2 }],
      ["\n", "escape", { start: 2, end: 8 }, { line: 2, column: 1 }],
      ["b", "source", { start: 8, end: 9 }, { line: 2, column: 7 }],
    ]);
    expect(rawCr.diagnostics).toEqual([]);
  });

  it("returns error diagnostics alongside translated output without a success-only result", () => {
    const result = processBytes(new Uint8Array([0xff, 0x61]));

    expect(result.text).toBe("\uFFFDa");
    expect(result.diagnostics).toHaveLength(1);
    expect(result.units[0]?.isError).toBe(true);
    expect(result.units[1]?.character).toBe("a");
  });
});
