import { describe, expect, it } from "vitest";
import {
  lexCore,
  processSource,
  scanCoreAt,
  SourceInput,
} from "../src/index.js";
import type { CoreToken } from "../src/index.js";

const encoder = new TextEncoder();

function lex(text: string) {
  return lexCore(new SourceInput(encoder.encode(text)));
}

function firstLiteral(text: string): CoreToken {
  const item = lex(text).items[0]!;
  expect(item.kind).toBe("token");
  if (item.kind !== "token") throw new Error("Expected a literal token");
  expect(item.literal).toBeDefined();
  return item;
}

function checkValue(text: string, value: string, kind = "string") {
  const token = firstLiteral(text);
  expect(token.tokenKind).toBe(kind);
  expect(token.literal).toMatchObject({
    value,
    kind,
    valid: true,
    terminated: true,
  });
  expect(lex(text).diagnostics).toEqual([]);
  expect(token.range.bytes).toEqual({
    start: 0,
    end: encoder.encode(text).length,
  });
  expect(token.nextUnitOffset).toBe(
    processSource(new SourceInput(encoder.encode(text))).units.length,
  );
}

describe("DEC-030/039–045/082 ordinary literal values", () => {
  it.each([
    ["a", "\x07"],
    ["b", "\b"],
    ["e", "\x1b"],
    ["f", "\f"],
    ["n", "\n"],
    ["r", "\r"],
    ["t", "\t"],
    ["v", "\v"],
    ["'", "'"],
    ['"', '"'],
    ["\\", "\\"],
  ])("decodes selected simple escape \\%s", (escape, value) => {
    checkValue(`"\\${escape}"`, value);
    checkValue(`'\\${escape}'`, value, "character");
  });

  it.each(Array.from({ length: 64 }, (_, offset) => offset + 0x3f))(
    "decodes every selected control operand U+%s",
    (codePoint) => {
      checkValue(
        `"\\c${String.fromCodePoint(codePoint)}"`,
        String.fromCodePoint(codePoint === 0x3f ? 0x7f : codePoint & 0x1f),
      );
    },
  );

  it.each([
    ["0", "\0"],
    ["000041", "A"],
    ["1f600", "😀"],
    ["10FFFF", "\u{10ffff}"],
    ["000000000000000000000000000000000000000061", "a"],
  ])("decodes scalar hex escape %s without a length limit", (digits, value) => {
    checkValue(`"\\x{${digits}}"`, value);
    checkValue(`'\\x{${digits}}'`, value, "character");
  });

  it.each([
    ["LATIN CAPITAL LETTER A", "A"],
    ["latin capital letter a", "A"],
    ["LaTiN CaPiTaL LeTtEr A", "A"],
    ["NULL", "\0"],
    ["NUL", "\0"],
    ["BYTE ORDER MARK", "\ufeff"],
    ["BELL", "🔔"],
    ["CJK UNIFIED IDEOGRAPH-4E00", "一"],
    ["MODIFIER LETTER ARMENIAN SMALL EH", "\u0558"],
  ])("resolves Unicode 18 names/official aliases: %s", (name, value) => {
    checkValue(`"\\N{${name}}"`, value);
    checkValue(`'\\N{${name}}'`, value, "character");
  });

  it.each([
    ["'😀'", "😀"],
    ["'e\u0301'", "é"],
    [String.raw`'e\u0301'`, "é"],
    ["'\u0344'", "\u0308\u0301"],
    ["'ab'", "ab"],
    ["''", ""],
    [String.raw`'e\x{301}'`, "e\u0301"],
  ])("checks decoded scalar count, not graphemes: %s", (text, value) => {
    const token = firstLiteral(text);
    const valid = [...value].length === 1;
    expect(token.literal).toMatchObject({ value, valid, terminated: true });
    expect(token.tokenKind).toBe(valid ? "character" : "error");
    expect(token.errorRole).toBe(valid ? undefined : "operand");
    expect(lex(text).diagnostics.map((d) => d.code)).toEqual(
      valid ? [] : ["invalid-character-length"],
    );
  });

  it.each([
    [String.raw`"e\u0301"`, "é"],
    [String.raw`"e\x{301}"`, "e\u0301"],
    [String.raw`"e\N{COMBINING ACUTE ACCENT}"`, "e\u0301"],
    [String.raw`"\u005Cn"`, "\n"],
    [String.raw`"\u005Cx{1F600}"`, "😀"],
    [String.raw`"\u005CN{LATIN CAPITAL LETTER A}"`, "A"],
    [String.raw`"\u005CcA"`, "\x01"],
    [String.raw`"\u005C\u0022"`, '"'],
    [String.raw`"\u005C\u005C"`, "\\"],
    [String.raw`\u0022a\u0022`, "a"],
  ])(
    "orders global translation, NFC and ordinary escapes: %s",
    (text, value) => {
      checkValue(text, value);
    },
  );

  it.each([
    "q",
    "0",
    "1",
    "7",
    "123",
    "o{123}",
    "x41",
    "x{}",
    "x{_}",
    "x{1_0}",
    "x{g}",
    "x{FFg}",
    "x{110000}",
    "x{D800}",
    "x{DFFF}",
    "x{41",
    "N{}",
    "N{U+0041}",
    "N{NOT A CHARACTER}",
    "N{ LATIN CAPITAL LETTER A}",
    "N{LATIN  CAPITAL LETTER A}",
    "N{LATIN CAPITAL LETTER A }",
    "N{LATIN-CAPITAL LETTER A}",
    "N{LATIN CAPITAL LETTER A",
    "N{KEYCAP NUMBER SIGN}",
    "c",
    "c!",
    "c ",
    "c0",
    "c>",
    "c\u007f",
    "cé",
    "u0041",
    "U00000041",
  ])("rejects unselected/malformed ordinary escape: \\%s", (escape) => {
    for (const quote of ["'", '"']) {
      // Generate the leading backslash globally for u/U, avoiding global retranslation.
      const backslash =
        escape.startsWith("u") || escape.startsWith("U") ? "\\u005C" : "\\";
      const text = `${quote}${backslash}${escape}${quote}`;
      const token = firstLiteral(text);
      expect(token.tokenKind).toBe("error");
      expect(token.errorRole).toBe("operand");
      expect(token.literal).toMatchObject({ valid: false, terminated: true });
      const escapeBody = escape.startsWith("c")
        ? [...escape].slice(0, 2).join("")
        : escape.startsWith("x{") || escape.startsWith("N{")
          ? escape
          : [...escape][0]!;
      expect(
        lex(text).diagnostics.filter(
          (d) => d.code === "invalid-literal-escape",
        ),
      ).toMatchObject([
        {
          code: "invalid-literal-escape",
          location: {
            start: 1,
            end: 1 + backslash.length + encoder.encode(escapeBody).length,
          },
        },
      ]);
      expect(token.range.bytes).toEqual({
        start: 0,
        end: encoder.encode(text).length,
      });
    }
  });

  it("keeps literal escape diagnostics on contributing original bytes after NFC composition", () => {
    const text = String.raw`"ok \n\u0303 end"`;
    const result = lex(text);
    expect(firstLiteral(text).tokenKind).toBe("error");
    expect(result.diagnostics).toMatchObject([
      {
        code: "invalid-literal-escape",
        location: { start: 4, end: 12 },
      },
    ]);
  });

  it.each([
    ['"é\\c\u0344 z"', { start: 3, end: 7 }],
    ['"é\\c\u0315\u0300 z"', { start: 3, end: 9 }],
    [String.raw`"é\u005Cq z"`, { start: 3, end: 10 }],
  ])(
    "maps decomposition/reordering/generated escapes, not unrelated prefix: %s",
    (text, location) => {
      expect(firstLiteral(text).tokenKind).toBe("error");
      expect(lex(text).diagnostics[0]).toMatchObject({
        code: "invalid-literal-escape",
        location,
      });
    },
  );
});

const endings = ["\n", "\r", "\r\n", "\u0085", "\v", "\f", "\u2028", "\u2029"];
const generatedEndings = endings.map((ending) =>
  [...ending]
    .map((c) => `\\u${c.codePointAt(0)!.toString(16).padStart(4, "0")}`)
    .join(""),
);
const allEndings = [...endings, ...generatedEndings, "\r\\u000a", "\\u000d\n"];

describe("DEC-032/035/036/077 literal line ending recovery", () => {
  it.each(allEndings)(
    "continues ordinary strings across physical/generated/mixed %j",
    (ending) => {
      // Two adjacent original backslashes would make the ending's \u ineligible.
      const backslash = ending.startsWith("\\u") ? "\\u005C" : "\\";
      checkValue(`"a${backslash}${ending} \t  b"`, "ab");
      checkValue(`"a\\u005C${ending}\t b"`, "ab");
    },
  );

  it.each(allEndings)(
    "interrupts ordinary literals before the entire ending %j",
    (ending) => {
      for (const quote of ["'", '"']) {
        const text = `${quote}a${ending}next`;
        const result = lex(text);
        const token = firstLiteral(text);
        expect(token.tokenKind).toBe("error");
        expect(token.errorRole).toBe("operand");
        expect(token.range.bytes).toEqual({ start: 0, end: 2 });
        expect(token.literal).toMatchObject({
          value: "a",
          terminated: false,
          valid: false,
        });
        expect(result.diagnostics).toMatchObject([
          {
            code: "unterminated-literal",
            location: { start: 0, end: 2 },
          },
        ]);
        expect(result.items[1]).toMatchObject({
          kind: "trivia",
          triviaKind: "whitespace",
          range: {
            bytes: { start: 2, end: 2 + encoder.encode(ending).length },
          },
        });
        expect(result.items[2]).toMatchObject({
          kind: "token",
          spelling: "next",
        });
        expect(result.status).toBe("complete");
        expect(
          result.items
            .map((item) => item.range.bytes)
            .reduce((end, range) => {
              expect(range.start).toBe(end);
              return range.end;
            }, 0),
        ).toBe(encoder.encode(text).length);
      }
    },
  );

  it.each(allEndings)(
    "rejects character continuation without consuming the newline %j",
    (ending) => {
      const backslash = ending.startsWith("\\u") ? "\\u005C" : "\\";
      const text = `'a${backslash}${ending}next`;
      const prefixEnd = 2 + backslash.length;
      const result = lex(text);
      expect(firstLiteral(text).range.bytes).toEqual({
        start: 0,
        end: prefixEnd,
      });
      expect(result.diagnostics.map((d) => d.code)).toContain(
        "unterminated-literal",
      );
      expect(result.items[1]).toMatchObject({
        kind: "trivia",
        range: { bytes: { start: prefixEnd } },
      });
      expect(result.items[2]).toMatchObject({
        kind: "token",
        spelling: "next",
      });
    },
  );

  it.each(["'", '"', "'a", '"a', '"a\\'])(
    "retains unterminated EOF candidate %j",
    (text) => {
      const token = firstLiteral(text);
      expect(token.tokenKind).toBe("error");
      expect(token.literal?.terminated).toBe(false);
      expect(token.range.bytes).toEqual({
        start: 0,
        end: encoder.encode(text).length,
      });
      expect(lex(text).diagnostics.map((d) => d.code)).toContain(
        "unterminated-literal",
      );
    },
  );
});

describe("DEC-026/027/055/082 tagged raw candidates", () => {
  it.each(["", "123", "_", "a_09Z", "TAG".repeat(400)])(
    "accepts ASCII tag %j",
    (tag) => {
      checkValue(
        `\`${tag}"e\u0301\\n\\x{41}\\N{NULL}"${tag}\``,
        "é\\n\\x{41}\\N{NULL}",
        "raw-string",
      );
    },
  );

  it.each(allEndings)("normalizes raw hard endings to LF: %j", (ending) => {
    checkValue(`\`"a${ending} \tb"\``, "a\n \tb", "raw-string");
  });

  it("only its own complete closer terminates the candidate", () => {
    const text = '`TAG"a"OTHER` b"TAGx` c"TAG`+next';
    const result = lex(text);
    expect(firstLiteral(text).literal).toMatchObject({
      value: 'a"OTHER` b"TAGx` c',
      valid: true,
    });
    expect(result.items.slice(1).map((item) => item.spelling)).toEqual([
      "+",
      "next",
    ]);
  });

  it("does not repeat global translation or interpret raw ordinary escapes", () => {
    checkValue(
      String.raw`\u0060"\u005Cu0041\q\o{123}"` + "`",
      "\\u0041\\q\\o{123}",
      "raw-string",
    );
  });

  it("uses unnormalized tag boundaries even when content NFC creates similar spelling", () => {
    const text = '`T"e\u0301"T`';
    const token = firstLiteral(text);
    expect(token.literal?.value).toBe("é");
    expect(token.spelling).toBe(text);
    expect(Object.isFrozen(token.literal)).toBe(true);
    expect(Object.isFrozen(token.literal?.diagnostics)).toBe(true);
  });

  it("an own closer is not escaped by a raw backslash", () => {
    const text = '`T"a\\"T`+b';
    expect(firstLiteral(text).literal?.value).toBe("a\\");
    expect(lex(text).items[1]).toMatchObject({ kind: "token", spelling: "+" });
  });

  it.each(['`"a', '`T"a"OTHER`', '`T"a"T', '`T"a"T\n'])(
    "retains mismatched/EOF raw candidate %j",
    (text) => {
      const token = firstLiteral(text);
      expect(token.tokenKind).toBe("error");
      expect(token.errorRole).toBe("operand");
      expect(token.literal).toMatchObject({
        kind: "raw-string",
        valid: false,
        terminated: false,
      });
      expect(token.range.bytes.end).toBe(encoder.encode(text).length);
      expect(lex(text).diagnostics).toMatchObject([
        { code: "unterminated-literal" },
      ]);
    },
  );

  it("recognizes globally generated raw delimiters/tags without normalizing tag syntax", () => {
    checkValue(
      String.raw`\u0060T\u0022e\u0301\u0022T\u0060`,
      "é",
      "raw-string",
    );
    expect(lex('`é"x"é`').items[0]?.kind).toBe("unsupported");
    expect(lex('`Ｔ"x"Ｔ`').items[0]?.kind).toBe("unsupported");
  });
});

describe("DEC-078 intact literal Unicode diagnostics and core integration", () => {
  it.each(["'", '"', '`T"'])(
    "preserves source error replacements without making the literal an error: %s",
    (open) => {
      const close = open === '`T"' ? '"T`' : open;
      for (const invalid of [
        encoder.encode("\\uD800"),
        Uint8Array.of(0xe2, 0x82),
      ]) {
        const bytes = Uint8Array.from([
          ...encoder.encode(open),
          ...invalid,
          ...encoder.encode(close),
        ]);
        const result = lexCore(new SourceInput(bytes));
        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toMatchObject({
          kind: "token",
          literal: { value: "\ufffd", valid: true, terminated: true },
          range: { bytes: { start: 0, end: bytes.length } },
        });
        expect(result.diagnostics).toHaveLength(1);
        expect(result.diagnostics[0]?.location).toEqual({
          start: open.length,
          end: open.length + invalid.length,
        });
        expect(result.source.units.find((unit) => unit.isError)?.origin).toBe(
          invalid[0] === 0x5c ? "invalid-escape" : "invalid-utf8",
        );
      }
      checkValue(
        `${open}\ufffd${close}`,
        "\ufffd",
        open === "'" ? "character" : open === '"' ? "string" : "raw-string",
      );
    },
  );

  it("direct scanning has the same literal diagnostics, range and progress as aggregate scanning", () => {
    const source = processSource(new SourceInput(encoder.encode('a"\\q"+b')));
    const token = scanCoreAt(source, 1);
    expect(token).toMatchObject({
      kind: "token",
      tokenKind: "error",
      errorRole: "operand",
      range: { unitStart: 1, unitEnd: 5, bytes: { start: 1, end: 5 } },
      nextUnitOffset: 5,
      literal: {
        diagnostics: [
          { code: "invalid-literal-escape", location: { start: 2, end: 4 } },
        ],
      },
    });
    expect(lex('a"\\q"+b').items.map((item) => item.spelling)).toEqual([
      "a",
      '"\\q"',
      "+",
      "b",
    ]);
  });

  it.each(["x", "N"])(
    "keeps every malformed UTF-8 error inside \\%s candidates",
    (escape) => {
      const bytes = Uint8Array.from([
        ...encoder.encode(`"\\${escape}{`),
        0xf0,
        0x80,
        0x80,
        ...encoder.encode('}"'),
      ]);
      const result = lexCore(new SourceInput(bytes));
      const literal = result.items[0]!;

      expect(literal).toMatchObject({
        kind: "token",
        tokenKind: "error",
        literal: {
          value: "\ufffd\ufffd\ufffd\ufffd",
          valid: false,
          diagnostics: [
            {
              code: "invalid-literal-escape",
              location: { start: 1, end: 8 },
            },
          ],
        },
      });
      expect(
        result.diagnostics.map(({ code, location }) => ({ code, location })),
      ).toEqual([
        { code: "invalid-literal-escape", location: { start: 1, end: 8 } },
        { code: "invalid-utf8", location: { start: 4, end: 5 } },
        { code: "invalid-utf8", location: { start: 5, end: 6 } },
        { code: "invalid-utf8", location: { start: 6, end: 7 } },
      ]);
    },
  );

  it.each([
    {
      label: "control escape",
      source: String.raw`"\c\uD800"`,
      escapeRange: { start: 1, end: 9 },
      sourceRange: { start: 3, end: 9 },
    },
    {
      label: "generated unknown escape",
      source: String.raw`"\u005C\uD800"`,
      escapeRange: { start: 1, end: 13 },
      sourceRange: { start: 7, end: 13 },
    },
    {
      label: "hex escape body",
      source: String.raw`"\x{\uD800}"`,
      escapeRange: { start: 1, end: 11 },
      sourceRange: { start: 4, end: 10 },
    },
  ])(
    "preserves malformed global replacements consumed by $label",
    ({ source, escapeRange, sourceRange }) => {
      const result = lex(source);
      expect(result.items[0]).toMatchObject({
        kind: "token",
        tokenKind: "error",
        literal: {
          value: "\ufffd\ufffd",
          valid: false,
          diagnostics: [
            {
              code: "invalid-literal-escape",
              location: escapeRange,
            },
          ],
        },
      });
      expect(
        result.diagnostics.map(({ code, location }) => ({ code, location })),
      ).toEqual([
        { code: "invalid-literal-escape", location: escapeRange },
        { code: "invalid-unicode-escape", location: sourceRange },
      ]);
    },
  );

  it("keeps adjacent global error characters and distinguishes literal U+FFFD", () => {
    expect(lex(String.raw`"\uD800\n"`).items[0]).toMatchObject({
      kind: "token",
      tokenKind: "string",
      literal: { value: "\ufffd\n", valid: true },
    });
    expect(lex(String.raw`"\x{�}"`).items[0]).toMatchObject({
      kind: "token",
      tokenKind: "error",
      literal: {
        value: "\ufffd",
        diagnostics: [
          { code: "invalid-literal-escape", location: { start: 1, end: 8 } },
        ],
      },
    });
  });

  it("counts source errors and malformed-escape replacement in character length validation", () => {
    const bytes = Uint8Array.from([
      ...encoder.encode("'\\x{"),
      0xf0,
      0x80,
      0x80,
      ...encoder.encode("}'"),
    ]);
    const result = lexCore(new SourceInput(bytes));
    expect(result.items[0]).toMatchObject({
      kind: "token",
      tokenKind: "error",
      literal: {
        value: "\ufffd\ufffd\ufffd\ufffd",
        diagnostics: [
          { code: "invalid-character-length", location: { start: 0, end: 9 } },
          { code: "invalid-literal-escape", location: { start: 1, end: 8 } },
        ],
      },
    });
  });

  it("scans literals losslessly with BOM, comments and a following number", () => {
    const text = '\ufeff/*x*/"é"+\'😀\' `""` 123';
    const result = lex(text);
    expect(
      result.items
        .filter((item) => item.kind === "token")
        .map((item) => item.tokenKind),
    ).toEqual(["string", "operator", "character", "raw-string", "number"]);
    expect(result.items.at(-1)).toMatchObject({
      kind: "token",
      tokenKind: "number",
      spelling: "123",
    });
    const bytes = encoder.encode(text);
    expect(
      Uint8Array.from(
        result.items.flatMap((item) => [
          ...bytes.slice(item.range.bytes.start, item.range.bytes.end),
        ]),
      ),
    ).toEqual(bytes);
    expect(result.diagnostics).toEqual([]);
  });

  it("does not remove non-ASCII spaces following continuation", () => {
    checkValue('"a\\\n \t\u00a0b"', "a\u00a0b");
  });

  it("keeps literal U+FFFD distinct from several original malformed subparts", () => {
    const bytes = Uint8Array.from([
      0x22,
      0xf0,
      0x80,
      0x80,
      ...encoder.encode("\ufffd"),
      0x22,
    ]);
    const result = lexCore(new SourceInput(bytes));
    expect(result.items[0]).toMatchObject({
      tokenKind: "string",
      literal: { value: "\ufffd".repeat(4), valid: true },
    });
    expect(result.diagnostics.map((diagnostic) => diagnostic.location)).toEqual(
      [
        { start: 1, end: 2 },
        { start: 2, end: 3 },
        { start: 3, end: 4 },
      ],
    );
    expect(result.source.units.map((unit) => unit.isError)).toEqual([
      false,
      true,
      true,
      true,
      false,
      false,
    ]);
  });
});
