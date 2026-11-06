import { describe, expect, it } from "vitest";
import {
  lexCore,
  normalizeUnicode18,
  scanCoreAt,
  SourceInput,
} from "../src/index.js";

function lex(text: string) {
  return lexCore(new SourceInput(new TextEncoder().encode(text)));
}

function tokenSummaries(text: string) {
  return lex(text).items
    .filter((item) => item.kind === "token")
    .map((item) => [item.tokenKind, item.spelling]);
}

describe("Unicode 18 normalization API", () => {
  it("uses version-pinned NFC display and NFKC lookup forms", () => {
    expect(normalizeUnicode18("e\u0301", "NFC")).toBe("é");
    expect(normalizeUnicode18("K", "NFC")).toBe("K");
    expect(normalizeUnicode18("K", "NFKC")).toBe("K");
    expect(normalizeUnicode18("①", "NFC")).toBe("①");
    expect(normalizeUnicode18("①", "NFKC")).toBe("1");
    expect(normalizeUnicode18("\u{1E030}", "NFKC")).toBe("а");
  });
});

describe("core lexer", () => {
  it("recognizes translated XID identifiers and normalized identifier forms", () => {
    const result = lex("e\u0301 K \\u0558");
    const identifiers = result.items.filter(
      (item) => item.kind === "token" && item.tokenKind === "identifier",
    );
    expect(identifiers).toHaveLength(3);
    if (identifiers[0]?.kind !== "token" || !identifiers[0].identifier) {
      throw new Error("expected first item to be an identifier token");
    }
    expect(identifiers[0].identifier).toEqual({
      translatedText: "e\u0301",
      displayName: "é",
      lookupName: "é",
    });
    expect(identifiers[1]?.kind === "token" && identifiers[1].identifier).toEqual({
      translatedText: "K",
      displayName: "K",
      lookupName: "K",
    });
    expect(identifiers[2]?.kind === "token" && identifiers[2].identifier).toEqual({
      translatedText: "՘",
      displayName: "՘",
      lookupName: "է",
    });
  });

  it("rejects underscore as an identifier start and recognizes all grouping delimiters", () => {
    const result = lex("_a(){}[]");
    expect(result.items.map((item) => item.kind === "token"
      ? [item.tokenKind, item.spelling]
      : item.kind)).toEqual([
      "unsupported",
      ["identifier", "a"],
      ["delimiter", "("],
      ["delimiter", ")"],
      ["delimiter", "{"],
      ["delimiter", "}"],
      ["delimiter", "["],
      ["delimiter", "]"],
    ]);
  });

  it("uses longest source-operator matching for the approved inventory", () => {
    const inventory = [
      "::=", ":=", "::", "=", "@", "++", "--", "!", "~", "**", "*", "/", "%", "+", "-",
      "<<", ">>", "&", "^", "|", "<", "<=", ">", ">=", "==", "!=", "&&", "||",
      "<-", "->", "?", ":", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=",
      "<<=", ">>=", ",", ";", ".",
    ];
    expect(tokenSummaries(inventory.join(" "))).toEqual(
      inventory.map((spelling) => ["operator", spelling]),
    );
    expect(tokenSummaries(">>= ::= <<= >>= ++ -- ** ::=")).toEqual([
      ["operator", ">>="],
      ["operator", "::="],
      ["operator", "<<="],
      ["operator", ">>="],
      ["operator", "++"],
      ["operator", "--"],
      ["operator", "**"],
      ["operator", "::="],
    ]);
  });

  it("keeps Unicode whitespace, CRLF, and comments as separating trivia", () => {
    const result = lex("left\u00a0\u2003// line\r\n/* outer /* inner */right");
    expect(result.items.map((item) => item.kind === "token"
      ? [item.tokenKind, item.spelling]
      : [item.kind, item.kind === "trivia" ? item.triviaKind : item.kind, item.spelling]))
      .toEqual([
        ["identifier", "left"],
        ["trivia", "whitespace", "\u00a0\u2003"],
        ["trivia", "line-comment", "// line"],
        ["trivia", "whitespace", "\r\n"],
        ["trivia", "block-comment", "/* outer /* inner */"],
        ["identifier", "right"],
      ]);
  });

  it("recognizes all selected Unicode hard breaks and keeps CRLF together", () => {
    const result = lex("\t\u00a0\u2003\n\r\n\u0085\u000b\u000c\u2028\u2029");
    expect(result.items.map((item) => item.kind === "trivia" && item.triviaKind === "whitespace"
      ? item.spelling
      : item.kind)).toEqual(["\t\u00a0\u2003\n\r\n\u0085\u000b\u000c\u2028\u2029"]);
    expect(result.items).toHaveLength(1);
  });

  it("ends line comments at every selected hard break, treating CRLF as one", () => {
    const result = lex("//a\n//b\r\n//c\u0085//d\u000b//e\u000c//f\u2028//g\u2029end");
    expect(result.items.map((item) => item.kind === "trivia"
      ? [item.triviaKind, item.spelling]
      : item.kind === "token"
        ? [item.tokenKind, item.spelling]
        : [item.kind, item.spelling])).toEqual([
      ["line-comment", "//a"],
      ["whitespace", "\n"],
      ["line-comment", "//b"],
      ["whitespace", "\r\n"],
      ["line-comment", "//c"],
      ["whitespace", "\u0085"],
      ["line-comment", "//d"],
      ["whitespace", "\u000b"],
      ["line-comment", "//e"],
      ["whitespace", "\u000c"],
      ["line-comment", "//f"],
      ["whitespace", "\u2028"],
      ["line-comment", "//g"],
      ["whitespace", "\u2029"],
      ["identifier", "end"],
    ]);
  });

  it("uses the translated hard break to end a line comment without losing escape bytes", () => {
    const input = new SourceInput(new TextEncoder().encode("// one\\u000Ay"));
    const result = lexCore(input);
    expect(result.items.map((item) => item.kind === "token"
      ? [item.tokenKind, item.spelling, item.range.bytes]
      : item.kind === "trivia"
        ? [item.triviaKind, item.spelling, item.range.bytes]
        : [item.kind, item.spelling, item.range.bytes])).toEqual([
      ["line-comment", "// one", { start: 0, end: 6 }],
      ["whitespace", "\n", { start: 6, end: 12 }],
      ["identifier", "y", { start: 12, end: 13 }],
    ]);
  });

  it("maps translated token spelling to the full original escape extent", () => {
    const result = lexCore(new SourceInput(new TextEncoder().encode("\\u0061")));
    expect(result.items[0]).toMatchObject({
      kind: "token",
      tokenKind: "identifier",
      spelling: "a",
      range: { unitStart: 0, unitEnd: 1, bytes: { start: 0, end: 6 } },
    });
  });

  it("keeps an unterminated block comment through EOF and retains embedded decode errors", () => {
    const bytes = new Uint8Array([
      ...new TextEncoder().encode("/*before "),
      0xff,
      ...new TextEncoder().encode(" after"),
    ]);
    const result = lexCore(new SourceInput(bytes));
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      kind: "trivia",
      triviaKind: "block-comment",
      terminated: false,
      spelling: "/*before \uFFFD after",
      range: { bytes: { start: 0, end: bytes.length } },
    });
    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "unterminated-block-comment",
      "invalid-utf8",
    ]);
  });

  it("recognizes escaped hard breaks and keeps invalid bytes and BOM in a lossless partition", () => {
    const bytes = new Uint8Array([
      0xef, 0xbb, 0xbf,
      ...new TextEncoder().encode("//line\\u000Aa/*c*/ b"),
      0xff,
      ...new TextEncoder().encode("c"),
    ]);
    const input = new SourceInput(bytes);
    const result = lexCore(input);
    const reconstructed = new Uint8Array(
      result.items.flatMap((item) => [...input.slice(item.range.bytes)]),
    );
    expect(reconstructed).toEqual(bytes);
    expect(result.items[0]).toMatchObject({
      kind: "trivia",
      triviaKind: "bom",
      range: { unitStart: 0, unitEnd: 0, bytes: { start: 0, end: 3 } },
    });
    expect(result.items.map((item) => item.kind === "token"
      ? [item.tokenKind, item.spelling]
      : item.kind === "trivia" ? item.triviaKind : item.kind)).toContain("line-comment");
  });

  it("scans numbers and later literals without deferral", () => {
    const result = lex("name 12 + \"text\"");
    expect(result.status).toBe("complete");
    expect(result.items.some((item) => item.kind === "token" && item.spelling === "12"))
      .toBe(true);
    expect(result.items.some((item) => item.kind === "token" && item.spelling === "\"text\""))
      .toBe(true);
    expect(scanCoreAt(result.source, 5)).toMatchObject({
      kind: "token",
      tokenKind: "number",
      range: { unitStart: 5, unitEnd: 7 },
    });
    expect(scanCoreAt(result.source, 10)).toMatchObject({
      kind: "token",
      tokenKind: "string",
      literal: { value: "text", valid: true },
      range: { unitStart: 10, unitEnd: 16 },
    });
  });

  it("measures numeric spans in scalar units after supplementary text", () => {
    const result = lex("𝒜 1 + x");
    expect(result.items[2]).toMatchObject({
      kind: "token",
      tokenKind: "number",
      spelling: "1",
      range: { unitStart: 2, unitEnd: 3, bytes: { start: 5, end: 6 } },
    });
  });

  it("recognizes dot-number candidates and touching operand errors", () => {
    const touching = lex("a.5");
    expect(touching.items).toHaveLength(1);
    expect(touching.items[0]).toMatchObject({
      kind: "token", tokenKind: "error", errorRole: "operand",
      spelling: "a.5",
      range: { unitStart: 0, unitEnd: 3 },
    });

    const separated = lex("a .5");
    expect(separated.items.map((item) => item.kind)).toEqual([
      "token",
      "trivia",
      "token",
    ]);
  });

  it("reports genuinely unsupported input as an explicit unknown-character error", () => {
    const result = lex("#");
    expect(result.status).toBe("unsupported");
    expect(result.items[0]).toMatchObject({
      kind: "unsupported",
      codePoint: 0x23,
      range: { unitStart: 0, unitEnd: 1, bytes: { start: 0, end: 1 } },
    });
    expect(result.diagnostics).toMatchObject([
      {
        code: "unrecognized-character",
        severity: "error",
        location: { start: 0, end: 1 },
      },
    ]);
  });
});
