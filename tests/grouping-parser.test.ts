import { describe, expect, it } from "vitest";
import {
  lexCore,
  processSource,
  SourceInput,
  structureCore,
  type CoreLexResult,
  type CoreToken,
  type CoreTrivia,
} from "../src/index.js";

function fixture(
  text: string,
  items: CoreLexResult["items"],
  diagnostics: CoreLexResult["diagnostics"] = [],
): CoreLexResult {
  return {
    source: processSource(new SourceInput(new TextEncoder().encode(text))),
    items,
    diagnostics,
    status: "complete",
  };
}

function token(
  source: CoreLexResult["source"],
  tokenKind: CoreToken["tokenKind"],
  spelling: string,
  start: number,
  end = start + [...spelling].length,
): CoreToken {
  return Object.freeze({
    kind: "token",
    tokenKind,
    spelling,
    range: Object.freeze({
      unitStart: start,
      unitEnd: end,
      bytes: source.originalRange(start, end),
    }),
    nextUnitOffset: end,
  });
}

function trivia(
  source: CoreLexResult["source"],
  spelling: string,
  start: number,
): CoreTrivia {
  return Object.freeze({
    kind: "trivia",
    triviaKind: "whitespace",
    spelling,
    range: Object.freeze({
      unitStart: start,
      unitEnd: start + [...spelling].length,
      bytes: source.originalRange(start, start + [...spelling].length),
    }),
    nextUnitOffset: start + [...spelling].length,
  });
}

function signature(
  entries: ReturnType<typeof structureCore>["root"]["entries"],
) {
  return entries
    .filter((entry) => entry.kind !== "trivia")
    .map((entry) => {
      if (entry.kind === "operand") {
        return entry.operandKind === "token"
          ? `operand:${entry.token.spelling}`
          : "operand:EMPTY";
      }
      if (entry.kind === "operator") {
        return entry.operatorKind === "explicit"
          ? `operator:${entry.token.spelling}`
          : "operator:APPLY";
      }
      if (entry.kind === "group") return "operand:group";
      return "error";
    });
}

describe("structural grouping and implicit elements", () => {
  it("inserts only the minimum APPLY and EMPTY elements around explicit tokens", () => {
    const source = processSource(
      new SourceInput(new TextEncoder().encode("+a b +")),
    );
    const result = structureCore(
      fixture("+a b +", [
        token(source, "operator", "+", 0),
        token(source, "identifier", "a", 1),
        token(source, "identifier", "b", 3),
        token(source, "operator", "+", 5),
      ]),
    );

    expect(signature(result.root.entries)).toEqual([
      "operand:EMPTY",
      "operator:+",
      "operand:a",
      "operator:APPLY",
      "operand:b",
      "operator:+",
      "operand:EMPTY",
    ]);
    expect(
      result.root.entries
        .filter(
          (entry) =>
            (entry.kind === "operand" && entry.operandKind === "empty") ||
            (entry.kind === "operator" && entry.operatorKind === "apply"),
        )
        .map((entry) => entry.span),
    ).toEqual([
      { start: 0, end: 0 },
      { start: 3, end: 3 },
      { start: 6, end: 6 },
    ]);
  });

  it("inserts EMPTY between adjacent operators and none into an already alternating run", () => {
    const text = "+ - a + b";
    const source = processSource(
      new SourceInput(new TextEncoder().encode(text)),
    );
    const result = structureCore(
      fixture(text, [
        token(source, "operator", "+", 0),
        trivia(source, " ", 1),
        token(source, "operator", "-", 2),
        trivia(source, " ", 3),
        token(source, "identifier", "a", 4),
        trivia(source, " ", 5),
        token(source, "operator", "+", 6),
        trivia(source, " ", 7),
        token(source, "identifier", "b", 8),
      ]),
    );

    expect(signature(result.root.entries)).toEqual([
      "operand:EMPTY",
      "operator:+",
      "operand:EMPTY",
      "operator:-",
      "operand:a",
      "operator:+",
      "operand:b",
    ]);
    expect(
      result.root.entries
        .filter(
          (entry) => entry.kind === "operand" && entry.operandKind === "empty",
        )
        .map((entry) => entry.span),
    ).toEqual([
      { start: 0, end: 0 },
      { start: 2, end: 2 },
    ]);
  });

  it("represents empty and trivia-only input with one EMPTY at the EOF byte anchor", () => {
    const empty = structureCore(fixture("", []));
    expect(signature(empty.root.entries)).toEqual(["operand:EMPTY"]);
    expect(empty.root.entries[0]).toMatchObject({
      kind: "operand",
      operandKind: "empty",
      span: { start: 0, end: 0 },
    });

    const text = " \t";
    const source = processSource(
      new SourceInput(new TextEncoder().encode(text)),
    );
    const triviaOnly = structureCore(fixture(text, [trivia(source, " \t", 0)]));
    expect(signature(triviaOnly.root.entries)).toEqual(["operand:EMPTY"]);
    expect(triviaOnly.root.entries.at(-1)).toMatchObject({
      kind: "operand",
      operandKind: "empty",
      span: { start: 2, end: 2 },
    });

    const commentOnly = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode("/*only*/"))),
    );
    expect(signature(commentOnly.root.entries)).toEqual(["operand:EMPTY"]);
    expect(commentOnly.root.entries.at(-1)?.span).toEqual({ start: 8, end: 8 });

    const bomOnly = structureCore(
      lexCore(new SourceInput(new Uint8Array([0xef, 0xbb, 0xbf]))),
    );
    expect(signature(bomOnly.root.entries)).toEqual(["operand:EMPTY"]);
    expect(bomOnly.root.entries.at(-1)?.span).toEqual({ start: 3, end: 3 });
  });

  it("recursively groups all delimiter families with independent inner sequences", () => {
    const text = "([{}])";
    const result = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode(text))),
    );
    const outer = result.root.entries.find((entry) => entry.kind === "group");
    expect(outer).toMatchObject({
      kind: "group",
      open: { spelling: "(" },
      close: { spelling: ")" },
    });
    if (outer?.kind !== "group") throw new Error("expected outer group");

    const square = outer.contents.entries.find(
      (entry) => entry.kind === "group",
    );
    expect(square).toMatchObject({
      kind: "group",
      open: { spelling: "[" },
      close: { spelling: "]" },
    });
    if (square?.kind !== "group") throw new Error("expected square group");
    const curly = square.contents.entries.find(
      (entry) => entry.kind === "group",
    );
    expect(curly).toMatchObject({
      kind: "group",
      open: { spelling: "{" },
      close: { spelling: "}" },
    });
    if (curly?.kind !== "group") throw new Error("expected curly group");

    expect(signature(result.root.entries)).toEqual(["operand:group"]);
    expect(signature(outer.contents.entries)).toEqual(["operand:group"]);
    expect(signature(square.contents.entries)).toEqual(["operand:group"]);
    expect(signature(curly.contents.entries)).toEqual(["operand:EMPTY"]);
    expect(curly.contents.span).toEqual({ start: 3, end: 3 });
    expect(curly.contents.entries[0]?.span).toEqual({ start: 3, end: 3 });
  });

  it("gives every delimiter family an EMPTY interior, including trivia-only groups", () => {
    const result = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode("() [] {/*inside*/}"))),
    );
    const groups = result.root.entries.filter(
      (entry) => entry.kind === "group",
    );
    expect(groups).toHaveLength(3);
    for (const group of groups) {
      if (group.kind !== "group") throw new Error("expected group");
      expect(signature(group.contents.entries)).toEqual(["operand:EMPTY"]);
    }
    const curly = groups[2];
    if (curly?.kind !== "group") throw new Error("expected curly group");
    expect(
      curly.contents.entries.some((entry) => entry.kind === "trivia"),
    ).toBe(true);
    expect(curly.contents.entries.at(-1)?.span).toEqual({
      start: curly.close.span.start,
      end: curly.close.span.start,
    });
  });

  it("uses each complete group as an outer operand while grouping its interior independently", () => {
    const text = "a(b c)d";
    const source = processSource(
      new SourceInput(new TextEncoder().encode(text)),
    );
    const result = structureCore(
      fixture(text, [
        token(source, "identifier", "a", 0),
        token(source, "delimiter", "(", 1),
        token(source, "identifier", "b", 2),
        trivia(source, " ", 3),
        token(source, "identifier", "c", 4),
        token(source, "delimiter", ")", 5),
        token(source, "identifier", "d", 6),
      ]),
    );
    const group = result.root.entries.find((entry) => entry.kind === "group");
    if (group?.kind !== "group") throw new Error("expected group operand");

    expect(signature(result.root.entries)).toEqual([
      "operand:a",
      "operator:APPLY",
      "operand:group",
      "operator:APPLY",
      "operand:d",
    ]);
    expect(signature(group.contents.entries)).toEqual([
      "operand:b",
      "operator:APPLY",
      "operand:c",
    ]);
    expect(group.contents.span).toEqual({ start: 2, end: 5 });
    expect(
      result.root.entries
        .filter(
          (entry) =>
            entry.kind === "operator" && entry.operatorKind === "apply",
        )
        .map((entry) => entry.span),
    ).toEqual([
      { start: 1, end: 1 },
      { start: 6, end: 6 },
    ]);
    expect(
      group.contents.entries.find(
        (entry) => entry.kind === "operator" && entry.operatorKind === "apply",
      )?.span,
    ).toEqual({ start: 4, end: 4 });
  });

  it("keeps mismatched closers as errors and inserts outstanding closers at EOF", () => {
    const result = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode("([a)]"))),
    );
    const outer = result.root.entries.find((entry) => entry.kind === "group");
    if (outer?.kind !== "group") throw new Error("expected outer group");
    const inner = outer.contents.entries.find(
      (entry) => entry.kind === "group",
    );
    if (inner?.kind !== "group") throw new Error("expected inner group");

    expect(inner.contents.entries).toContainEqual(
      expect.objectContaining({
        kind: "error",
        errorRole: "operand",
        components: [
          expect.objectContaining({
            kind: "error-part",
            source: expect.objectContaining({ spelling: ")" }),
            errorKind: "unexpected-closer",
          }),
        ],
      }),
    );
    expect(inner.close).toMatchObject({
      spelling: "]",
      synthetic: false,
    });
    expect(outer.close).toMatchObject({
      spelling: ")",
      synthetic: true,
      span: { start: 5, end: 5 },
    });
    expect(result.diagnostics.map(({ code }) => code)).toContain(
      "missing-closing-delimiter",
    );
    expect(result.diagnostics.map(({ code }) => code)).toContain(
      "unexpected-closing-delimiter",
    );
  });

  it("collapses adjacent unmatched closers, keeping both diagnostics, and closes nested groups", () => {
    const text = ")}";
    const result = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode(text))),
    );
    const errors = result.root.entries.filter(
      (entry) => entry.kind === "error",
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]!.kind === "error" && errors[0]!.components).toHaveLength(
      2,
    );
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      "unexpected-closing-delimiter",
      "unexpected-closing-delimiter",
    ]);

    const rootCloser = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode(")"))),
    );
    expect(rootCloser.diagnostics[0]).toMatchObject({
      code: "unexpected-closing-delimiter",
      message: "Closing delimiter ) has no open delimiter.",
    });

    const nested = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode("({"))),
    );
    const outer = nested.root.entries.find((entry) => entry.kind === "group");
    if (outer?.kind !== "group") throw new Error("expected outer group");
    const inner = outer.contents.entries.find(
      (entry) => entry.kind === "group",
    );
    if (inner?.kind !== "group") throw new Error("expected inner group");
    expect(inner.close).toMatchObject({
      spelling: "}",
      synthetic: true,
      span: { start: 2, end: 2 },
    });
    expect(outer.close).toMatchObject({
      spelling: ")",
      synthetic: true,
      span: { start: 2, end: 2 },
    });
  });

  it("handles deep nesting with an explicit stack instead of recursive descent", () => {
    const depth = 1_500;
    const text = "(".repeat(depth) + ")".repeat(depth);
    const result = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode(text))),
    );
    let entry = result.root.entries[0];
    for (let level = 0; level < depth; level++) {
      expect(entry?.kind).toBe("group");
      if (entry?.kind !== "group") return;
      entry = entry.contents.entries[0];
    }
    expect(entry).toMatchObject({
      kind: "operand",
      operandKind: "empty",
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("classifies lexer errors contextually and retains lexer diagnostics", () => {
    const lexed = lexCore(new SourceInput(new TextEncoder().encode("a § b")));
    const result = structureCore(lexed);
    expect(
      result.root.entries.some(
        (entry) =>
          entry.kind === "error" &&
          entry.components.some(
            (part) => part.kind === "error-part" && part.errorKind === "lexer",
          ),
      ),
    ).toBe(true);
    expect(result.diagnostics).toEqual(lexed.diagnostics);
    expect(
      result.root.entries.some(
        (entry) => entry.kind === "error" && entry.errorRole === "operator",
      ),
    ).toBe(true);

    const malformedLiteral = structureCore(
      lexCore(new SourceInput(new TextEncoder().encode(String.raw`a "\q" b`))),
    );
    expect(
      malformedLiteral.root.entries.filter((entry) => entry.kind === "error"),
    ).toHaveLength(1);
    expect(
      malformedLiteral.root.entries.filter(
        (entry) => entry.kind === "error",
      )[0],
    ).toMatchObject({
      errorRole: "operand",
      components: [expect.objectContaining({ errorKind: "lexer" })],
    });
    expect(signature(malformedLiteral.root.entries)).toEqual([
      "operand:a",
      "operator:APPLY",
      "error",
      "operator:APPLY",
      "operand:b",
    ]);
  });

  it("anchors synthetic elements at byte positions and preserves original trivia bytes", () => {
    const bytes = new TextEncoder().encode("\uFEFF\\u0061 /*x*/ (b)");
    const input = new SourceInput(bytes);
    const lexed = lexCore(input);
    const result = structureCore(lexed);
    const apply = result.root.entries.find(
      (entry) => entry.kind === "operator" && entry.operatorKind === "apply",
    );
    expect(apply).toMatchObject({
      span: { start: 16, end: 16 },
      synthetic: true,
    });

    const reconstructed = new Uint8Array(
      result.root.entries.flatMap((entry) => originalBytes(entry, input)),
    );
    expect(reconstructed).toEqual(bytes);
  });
});

function originalBytes(
  entry: ReturnType<typeof structureCore>["root"]["entries"][number],
  input: SourceInput,
): number[] {
  if (entry.kind === "trivia") {
    return [...input.slice(entry.source.range.bytes)];
  }
  if (entry.kind === "operand" && entry.operandKind === "token") {
    return [...input.slice(entry.token.range.bytes)];
  }
  if (entry.kind === "operator" && entry.operatorKind === "explicit") {
    return [...input.slice(entry.token.range.bytes)];
  }
  if (entry.kind === "group") {
    return [
      ...input.slice(entry.open.range.bytes),
      ...entry.contents.entries.flatMap((child) => originalBytes(child, input)),
      ...(entry.close.token
        ? [...input.slice(entry.close.token.range.bytes)]
        : []),
    ];
  }
  if (entry.kind === "error") {
    return entry.components.flatMap((part) => [
      ...input.slice(part.source.range.bytes),
    ]);
  }
  return [];
}
