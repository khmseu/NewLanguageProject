import { describe, expect, it } from "vitest";
import {
  ERROR_OPERATOR_PRECEDENCE,
  lexCore,
  parseSource,
  reconstructSource,
  SourceInput,
  type CstEntry,
  type CstExpression,
  type CstParseResult,
  type CstSequence,
} from "../src/index.js";

const encoder = new TextEncoder();

function inputOf(text: string | readonly number[]): SourceInput {
  return new SourceInput(
    typeof text === "string" ? encoder.encode(text) : Uint8Array.from(text),
  );
}

function parse(text: string | readonly number[]): CstParseResult {
  return parseSource(inputOf(text));
}

/** Compact structural shape: significant entries only, errors show role and parts. */
function shape(sequence: CstSequence): string[] {
  return sequence.entries
    .filter((entry) => entry.kind !== "trivia")
    .map(entryShape);
}

function entryShape(entry: CstEntry): string {
  switch (entry.kind) {
    case "operand":
      return entry.operandKind === "empty" ? "EMPTY" : entry.token.spelling;
    case "operator":
      return entry.operatorKind === "apply"
        ? "APPLY"
        : (entry as { token: { spelling: string } }).token.spelling;
    case "group":
      return `${entry.open.spelling}${shape(entry.contents).join(" ")}${entry.close.spelling}`;
    case "error":
      return `E:${entry.errorRole}[${entry.components
        .filter((part) => part.kind === "error-part")
        .map(
          (part) => (part as { source: { spelling: string } }).source.spelling,
        )
        .join("|")}]`;
    case "trivia":
      return "";
  }
}

function tree(node: CstExpression): string {
  switch (node.kind) {
    case "binary": {
      const operator =
        node.operator.operatorKind === "apply"
          ? "APPLY"
          : node.operator.operatorKind === "error"
            ? `E[${node.operator.error.components
                .filter((c) => c.kind === "error-part")
                .map(
                  (c) =>
                    (c as { source: { spelling: string } }).source.spelling,
                )
                .join("|")}]`
            : node.operator.token.spelling;
      return `(${operator} ${tree(node.left)} ${tree(node.right)})`;
    }
    case "group-expression":
      return `group(${node.contents.expression ? tree(node.contents.expression) : "PARTIAL"})`;
    case "operand":
      return node.operandKind === "empty" ? "EMPTY" : node.token.spelling;
    case "error-operand":
      return `E[${node.error.components
        .filter((c) => c.kind === "error-part")
        .map((c) => (c as { source: { spelling: string } }).source.spelling)
        .join("|")}]`;
  }
}

function treeOf(text: string | readonly number[]): string {
  const result = parse(text);
  expect(result.status).toBe("error");
  expect(
    result.root.expression,
    "full tree retained on malformed input",
  ).toBeDefined();
  return tree(result.root.expression!);
}

describe("DEC-068/079 contextual error roles", () => {
  it.each([
    ["§", ["E:operand[§]"]],
    ["a § b", ["a", "E:operator[§]", "b"]],
    ["a § + b", ["a", "APPLY", "E:operand[§]", "+", "b"]],
    ["+ § b", ["EMPTY", "+", "E:operand[§]", "APPLY", "b"]],
    ["a + § + b", ["a", "+", "E:operand[§]", "+", "b"]],
    ["a + §", ["a", "+", "E:operand[§]"]],
    ["a §", ["a", "APPLY", "E:operand[§]"]],
    ["§ a", ["E:operand[§]", "APPLY", "a"]],
    ["§ + a", ["E:operand[§]", "+", "a"]],
    ["(a) § (b)", ["(a)", "E:operator[§]", "(b)"]],
    ["a ) b", ["a", "E:operator[)]", "b"]],
    [")", ["E:operand[)]"]],
  ])("classifies %j", (text, expected) => {
    expect(shape(parse(text).root.structure)).toEqual(expected);
  });

  it("empty groups and sole errors inside groups", () => {
    expect(shape(parse("(§)").root.structure)).toEqual(["(E:operand[§])"]);
    expect(shape(parse("(  /*c*/ )").root.structure)).toEqual(["(EMPTY)"]);
  });

  it("keeps lexically known operand errors operands, even when merged", () => {
    expect(shape(parse("a 0x b").root.structure)).toEqual([
      "a",
      "APPLY",
      "E:operand[0x]",
      "APPLY",
      "b",
    ]);
    expect(shape(parse("a 12foo b").root.structure)).toEqual([
      "a",
      "APPLY",
      "E:operand[12foo]",
      "APPLY",
      "b",
    ]);
    expect(shape(parse("a 0x § b").root.structure)).toEqual([
      "a",
      "APPLY",
      "E:operand[0x|§]",
      "APPLY",
      "b",
    ]);
  });

  it("collapses consecutive errors across whitespace and comments only", () => {
    const result = parse("a /*1*/ § /*2*/ § // z\n § b");
    const [entry] = result.root.structure.entries.filter(
      (e) => e.kind === "error",
    );
    expect(shape(result.root.structure)).toEqual([
      "a",
      "E:operator[§|§|§]",
      "b",
    ]);
    const components = entry!.kind === "error" ? entry!.components : [];
    expect(components.filter((c) => c.kind === "error-part")).toHaveLength(3);
    // Interior trivia (comments and whitespace) is owned by the collapsed error.
    expect(
      components
        .filter(
          (c) => c.kind === "trivia" && c.source.triviaKind !== "whitespace",
        )
        .map((c) => c.kind === "trivia" && c.source.spelling),
    ).toEqual(["/*2*/", "// z"]);
    expect(components[0]!.kind).toBe("error-part");
    expect(components.at(-1)!.kind).toBe("error-part");
    expect(entry!.span).toEqual({ start: 8, end: 28 });
    // Leading and trailing trivia stay outside the collapsed error.
    const topTrivia = result.root.structure.entries.filter(
      (e) => e.kind === "trivia",
    );
    expect(topTrivia.length).toBe(4);
    // Diagnostics stay one per constituent error.
    expect(
      result.diagnostics.filter((d) => d.code === "unrecognized-character"),
    ).toHaveLength(3);
  });

  it("does not collapse errors separated by a token, group or opener", () => {
    expect(shape(parse("§ a §").root.structure)).toEqual([
      "E:operand[§]",
      "APPLY",
      "a",
      "APPLY",
      "E:operand[§]",
    ]);
    expect(shape(parse("§ (§)").root.structure)).toEqual([
      "E:operand[§]",
      "APPLY",
      "(E:operand[§])",
    ]);
  });

  it("keeps the unexpected closer and fallback parts distinct inside one collapse", () => {
    const result = parse("a ) § b");
    const error = result.root.structure.entries.find(
      (e) => e.kind === "error",
    )!;
    expect(
      error.kind === "error" &&
        error.components
          .filter((c) => c.kind === "error-part")
          .map((c) => (c as { errorKind: string }).errorKind),
    ).toEqual(["unexpected-closer", "lexer"]);
    expect(error.span).toEqual({ start: 2, end: 6 });
    expect(result.diagnostics.map((d) => d.code).sort()).toEqual([
      "unexpected-closing-delimiter",
      "unrecognized-character",
    ]);
  });

  it("applies DEC-081 to mismatched closers", () => {
    const result = parse("([a)]");
    expect(shape(result.root.structure)).toEqual(["([a APPLY E:operand[)]])"]);
    expect(result.status).toBe("error");
  });
});

describe("DEC-086 tightest left-associative operator errors", () => {
  it("binds an operator-classified error tighter than every source operator", () => {
    expect(treeOf("a § b + c")).toBe("(+ (E[§] a b) c)");
    expect(treeOf("@x § y")).toBe("(@ EMPTY (E[§] x y))");
    expect(treeOf("a § b § c")).toBe("(E[§] (E[§] a b) c)");
  });

  it("is left associative for distinct collapsed errors", () => {
    expect(treeOf("a § b ¶ c")).toBe("(E[¶] (E[§] a b) c)");
    expect(treeOf("a * b § c ** d")).toBe("(* a (** (E[§] b c) d))");
  });

  it("exports its binding", () => {
    expect(ERROR_OPERATOR_PRECEDENCE).toEqual({
      priority: -1,
      associativity: "left",
    });
  });
});

describe("Unicode source units", () => {
  it("keeps malformed UTF-8 maximal subparts as separate parts collapsed by the parser", () => {
    const bytes = [0x61, 0x20, 0xf0, 0x80, 0x80, 0x20, 0x62];
    const result = parse(bytes);
    const error = result.root.structure.entries.find(
      (e) => e.kind === "error",
    )!;
    const parts =
      error.kind === "error"
        ? error.components.filter((c) => c.kind === "error-part")
        : [];
    expect(parts.map((p) => p.span)).toEqual([
      { start: 2, end: 3 },
      { start: 3, end: 4 },
      { start: 4, end: 5 },
    ]);
    expect(error.kind === "error" && error.errorRole).toBe("operator");
    expect(result.diagnostics).toEqual(lexCore(inputOf(bytes)).diagnostics);
    expect(result.status).toBe("error");
  });

  it("keeps a maximal subpart together", () => {
    const result = parse([0x61, 0x20, 0xe2, 0x82, 0x20, 0x62]);
    const error = result.root.structure.entries.find(
      (e) => e.kind === "error",
    )!;
    expect(
      error.kind === "error" &&
        error.components.filter((c) => c.kind === "error-part"),
    ).toHaveLength(1);
    expect(error.span).toEqual({ start: 2, end: 4 });
  });

  it("treats a malformed escape as one error part spanning its text and collapses with neighbors", () => {
    const result = parse(String.raw`a §\uD800§ b`);
    expect(shape(result.root.structure)).toEqual([
      "a",
      "E:operator[§|\uFFFD|§]",
      "b",
    ]);
    const error = result.root.structure.entries.find(
      (e) => e.kind === "error",
    )!;
    expect(error.span).toEqual({ start: 2, end: 12 });
  });

  it("only diagnoses malformed Unicode inside comments and literals", () => {
    const comment = parse([0x2f, 0x2a, 0xff, 0x2a, 0x2f]);
    expect(shape(comment.root.structure)).toEqual(["EMPTY"]);
    expect(comment.diagnostics.length).toBeGreaterThan(0);
    expect(comment.status).toBe("error");

    const literal = parse([0x22, 0xff, 0x22]);
    expect(shape(literal.root.structure)).toEqual(['"\uFFFD"']);
    expect(literal.diagnostics.length).toBeGreaterThan(0);
    expect(literal.status).toBe("error");
    expect(literal.root.expression).toMatchObject({
      kind: "operand",
      operandKind: "token",
    });
  });
});

describe("DEC-080 empty input and synthetic spans", () => {
  it.each(["", "   ", "\uFEFF", "\uFEFF /* c */\n// d"])(
    "is a single EMPTY for %j",
    (text) => {
      const result = parse(text);
      expect(shape(result.root.structure)).toEqual(["EMPTY"]);
      expect(result.status).toBe("complete");
      expect(reconstructSource(result, inputOf(text))).toEqual(
        encoder.encode(text),
      );
    },
  );

  it("anchors inserted elements without inventing bytes", () => {
    const apply = parse("ab /*c*/ d").root.structure.entries.find(
      (e) => e.kind === "operator" && e.operatorKind === "apply",
    );
    expect(apply?.span).toEqual({ start: 9, end: 9 });
    const trailing = parse("a + ")
      .root.structure.entries.filter((e) => e.kind !== "trivia")
      .at(-1);
    expect(trailing).toMatchObject({
      operandKind: "empty",
      span: { start: 3, end: 3 },
    });
  });
});

/** Independent oracle: simulate insertions per role assignment by brute force. */
function oracleCost(kinds: readonly ("O" | "P")[]): number {
  let expectOperand = true;
  let cost = 0;
  for (const kind of kinds) {
    if (kind === "O") {
      if (!expectOperand) cost++;
      expectOperand = false;
    } else {
      if (expectOperand) cost++;
      expectOperand = true;
    }
  }
  return expectOperand ? cost + 1 : cost;
}

function oracle(items: readonly string[]): { roles: string[]; cost: number } {
  const collapsed: string[] = [];
  for (const item of items) {
    if (
      (item === "E" || item === "K") &&
      (collapsed.at(-1) === "E" || collapsed.at(-1) === "K")
    ) {
      if (item === "K") collapsed[collapsed.length - 1] = "K";
      continue;
    }
    collapsed.push(item);
  }
  const errorIndexes = collapsed.flatMap((item, index) =>
    item === "E" || item === "K" ? [index] : [],
  );
  const variableIndexes = errorIndexes.filter(
    (index) => collapsed[index] === "E",
  );
  let best: { roles: string[]; cost: number } | undefined;
  for (let mask = 0; mask < 1 << variableIndexes.length; mask++) {
    // Bit set means operator; the lowest mask (all operands) wins ties.
    // K is a lexically designated operand error and never enters this choice.
    const kinds = collapsed.map((item) => (item === "P" ? "P" : "O")) as (
      "O" | "P"
    )[];
    variableIndexes.forEach((index, bit) => {
      const isOperator = ((mask >> bit) & 1) === 1;
      kinds[index] = isOperator ? "P" : "O";
    });
    const cost = oracleCost(kinds);
    const roles = errorIndexes.map((index) =>
      kinds[index] === "P" ? "operator" : "operand",
    );
    if (!best || cost < best.cost) best = { roles, cost };
  }
  return (
    best ?? {
      roles: [],
      cost: oracleCost(collapsed.map((i) => (i === "P" ? "P" : "O"))),
    }
  );
}

describe("DEC-092 lexically designated operand errors", () => {
  const fixtures = [
    {
      text: "a 0x b",
      items: ["O", "K", "O"],
      errorSpan: { start: 2, end: 4 },
      parts: [{ spelling: "0x", span: { start: 2, end: 4 } }],
      diagnosticCodes: ["invalid-number"],
      diagnosticLocations: [{ start: 2, end: 4 }],
      shape: ["a", "APPLY", "E:operand[0x]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[0x]) b)",
    },
    {
      text: "b 0x a",
      items: ["O", "K", "O"],
      errorSpan: { start: 2, end: 4 },
      parts: [{ spelling: "0x", span: { start: 2, end: 4 } }],
      diagnosticCodes: ["invalid-number"],
      diagnosticLocations: [{ start: 2, end: 4 }],
      shape: ["b", "APPLY", "E:operand[0x]", "APPLY", "a"],
      tree: "(APPLY (APPLY b E[0x]) a)",
    },
    {
      text: String.raw`a "\q" b`,
      items: ["O", "K", "O"],
      errorSpan: { start: 2, end: 6 },
      parts: [{ spelling: String.raw`"\q"`, span: { start: 2, end: 6 } }],
      diagnosticCodes: ["invalid-literal-escape"],
      diagnosticLocations: [{ start: 3, end: 5 }],
      shape: [
        "a",
        String.raw`APPLY`,
        String.raw`E:operand["\q"]`,
        "APPLY",
        "b",
      ],
      tree: String.raw`(APPLY (APPLY a E["\q"]) b)`,
    },
    {
      text: "a 12foo b",
      items: ["O", "K", "O"],
      errorSpan: { start: 2, end: 7 },
      parts: [{ spelling: "12foo", span: { start: 2, end: 7 } }],
      diagnosticCodes: ["invalid-number"],
      diagnosticLocations: [{ start: 2, end: 7 }],
      shape: ["a", "APPLY", "E:operand[12foo]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[12foo]) b)",
    },
    {
      text: "a 0x § b",
      items: ["O", "K", "E", "O"],
      errorSpan: { start: 2, end: 7 },
      parts: [
        { spelling: "0x", span: { start: 2, end: 4 } },
        { spelling: "§", span: { start: 5, end: 7 } },
      ],
      diagnosticCodes: ["invalid-number", "unrecognized-character"],
      diagnosticLocations: [
        { start: 2, end: 4 },
        { start: 5, end: 7 },
      ],
      shape: ["a", "APPLY", "E:operand[0x|§]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[0x|§]) b)",
    },
    {
      text: "a § 0x b",
      items: ["O", "E", "K", "O"],
      errorSpan: { start: 2, end: 7 },
      parts: [
        { spelling: "§", span: { start: 2, end: 4 } },
        { spelling: "0x", span: { start: 5, end: 7 } },
      ],
      diagnosticCodes: ["unrecognized-character", "invalid-number"],
      diagnosticLocations: [
        { start: 2, end: 4 },
        { start: 5, end: 7 },
      ],
      shape: ["a", "APPLY", "E:operand[§|0x]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[§|0x]) b)",
    },
    {
      text: "a 0x /*c*/ § b",
      items: ["O", "K", "E", "O"],
      errorSpan: { start: 2, end: 13 },
      parts: [
        { spelling: "0x", span: { start: 2, end: 4 } },
        { spelling: "§", span: { start: 11, end: 13 } },
      ],
      diagnosticCodes: ["invalid-number", "unrecognized-character"],
      diagnosticLocations: [
        { start: 2, end: 4 },
        { start: 11, end: 13 },
      ],
      shape: ["a", "APPLY", "E:operand[0x|§]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[0x|§]) b)",
    },
    {
      text: "a § /*c*/ 0x b",
      items: ["O", "E", "K", "O"],
      errorSpan: { start: 2, end: 13 },
      parts: [
        { spelling: "§", span: { start: 2, end: 4 } },
        { spelling: "0x", span: { start: 11, end: 13 } },
      ],
      diagnosticCodes: ["unrecognized-character", "invalid-number"],
      diagnosticLocations: [
        { start: 2, end: 4 },
        { start: 11, end: 13 },
      ],
      shape: ["a", "APPLY", "E:operand[§|0x]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[§|0x]) b)",
    },
    {
      text: "a 0x /*c*/ foo.5 b",
      items: ["O", "K", "K", "O"],
      errorSpan: { start: 2, end: 16 },
      parts: [
        { spelling: "0x", span: { start: 2, end: 4 } },
        { spelling: "foo.5", span: { start: 11, end: 16 } },
      ],
      diagnosticCodes: ["invalid-number", "touching-operands"],
      diagnosticLocations: [
        { start: 2, end: 4 },
        { start: 11, end: 16 },
      ],
      shape: ["a", "APPLY", "E:operand[0x|foo.5]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[0x|foo.5]) b)",
    },
    {
      text: "a foo.5 /*c*/ 0x b",
      items: ["O", "K", "K", "O"],
      errorSpan: { start: 2, end: 16 },
      parts: [
        { spelling: "foo.5", span: { start: 2, end: 7 } },
        { spelling: "0x", span: { start: 14, end: 16 } },
      ],
      diagnosticCodes: ["touching-operands", "invalid-number"],
      diagnosticLocations: [
        { start: 2, end: 7 },
        { start: 14, end: 16 },
      ],
      shape: ["a", "APPLY", "E:operand[foo.5|0x]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[foo.5|0x]) b)",
    },
    {
      text: "a 0x ) b",
      items: ["O", "K", "E", "O"],
      errorSpan: { start: 2, end: 6 },
      parts: [
        { spelling: "0x", span: { start: 2, end: 4 } },
        { spelling: ")", span: { start: 5, end: 6 } },
      ],
      diagnosticCodes: ["invalid-number", "unexpected-closing-delimiter"],
      diagnosticLocations: [
        { start: 2, end: 4 },
        { start: 5, end: 6 },
      ],
      shape: ["a", "APPLY", "E:operand[0x|)]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[0x|)]) b)",
    },
    {
      text: "a ) 0x b",
      items: ["O", "E", "K", "O"],
      errorSpan: { start: 2, end: 6 },
      parts: [
        { spelling: ")", span: { start: 2, end: 3 } },
        { spelling: "0x", span: { start: 4, end: 6 } },
      ],
      diagnosticCodes: ["unexpected-closing-delimiter", "invalid-number"],
      diagnosticLocations: [
        { start: 2, end: 3 },
        { start: 4, end: 6 },
      ],
      shape: ["a", "APPLY", "E:operand[)|0x]", "APPLY", "b"],
      tree: "(APPLY (APPLY a E[)|0x]) b)",
    },
  ] as const;

  it.each(fixtures)("constrains and preserves $text", (fixture) => {
    const expected = oracle(fixture.items);
    const result = parse(fixture.text);
    const input = inputOf(fixture.text);
    const entries = result.root.structure.entries.filter(
      (entry) => entry.kind !== "trivia",
    );
    const error = entries.find((entry) => entry.kind === "error");
    const errorParts =
      error?.kind === "error"
        ? error.components.filter(
            (component) => component.kind === "error-part",
          )
        : [];
    expect(expected).toEqual({ roles: ["operand"], cost: 2 });
    expect(result.status).toBe("error");
    expect(result.root.expression).toBeDefined();
    expect(shape(result.root.structure)).toEqual(fixture.shape);
    expect(tree(result.root.expression!)).toBe(fixture.tree);
    expect(
      entries.flatMap((entry) =>
        entry.kind === "error" ? [entry.errorRole] : [],
      ),
    ).toEqual(expected.roles);
    expect(
      entries.filter(
        (entry) =>
          (entry.kind === "operand" && entry.operandKind === "empty") ||
          (entry.kind === "operator" && entry.operatorKind === "apply"),
      ),
    ).toHaveLength(expected.cost);
    expect(error?.kind).toBe("error");
    if (error?.kind !== "error") throw new Error("expected a collapsed error");
    expect(error.errorRole).toBe("operand");
    expect(error.span).toEqual(fixture.errorSpan);
    expect(
      errorParts.map((part) => ({
        spelling: part.source.spelling,
        span: part.span,
      })),
    ).toEqual(fixture.parts);
    fixture.items.forEach((item, itemIndex) => {
      if (item !== "K") return;
      const knownPartIndex = fixture.items
        .slice(0, itemIndex)
        .filter((item) => item === "K" || item === "E").length;
      const knownPart = errorParts[knownPartIndex]!;
      expect(knownPart.kind).toBe("error-part");
      if (knownPart.kind !== "error-part")
        throw new Error("expected lexical error part");
      expect(knownPart.source.kind).toBe("token");
      if (knownPart.source.kind !== "token")
        throw new Error("expected known operand token");
      expect(knownPart.source.errorRole).toBe("operand");
    });
    expect(
      result.diagnostics.map(({ code, location }) => ({ code, location })),
    ).toEqual(
      fixture.diagnosticCodes.map((code, index) => ({
        code,
        location: fixture.diagnosticLocations[index],
      })),
    );
    expect(reconstructSource(result, input)).toEqual(input.bytes);
  });
});

describe("minimal-insertion exhaustive verification", () => {
  const alphabet: Record<string, string> = { O: "a", G: "(b)", P: "+", E: "§" };
  const symbols = Object.keys(alphabet);

  it("matches the brute-force oracle for every sequence up to length 6 (4^1..4^6)", () => {
    let checked = 0;
    const walk = (prefix: string[]): void => {
      if (prefix.length > 0) {
        const text = prefix.map((s) => alphabet[s]).join(" ");
        const result = parse(text);
        const expected = oracle(prefix.map((s) => (s === "G" ? "O" : s)));
        const entries = result.root.structure.entries.filter(
          (e) => e.kind !== "trivia",
        );
        const inserted = entries.filter(
          (e) =>
            (e.kind === "operand" && e.operandKind === "empty") ||
            (e.kind === "operator" && e.operatorKind === "apply"),
        ).length;
        const roles = entries.flatMap((e) =>
          e.kind === "error" ? [e.errorRole] : [],
        );
        expect({ text, inserted, roles }).toEqual({
          text,
          inserted: expected.cost,
          roles: expected.roles,
        });
        // Result is a strict alternation and a full tree is retained.
        const kinds = entries.map((e) =>
          e.kind === "operator" ||
          (e.kind === "error" && e.errorRole === "operator")
            ? "P"
            : "O",
        );
        expect(oracleCost(kinds), text).toBe(0);
        expect(result.root.expression, text).toBeDefined();
        expect(result.status, text).toBe(
          prefix.includes("E") ? "error" : "complete",
        );
        expect(reconstructSource(result, inputOf(text)), text).toEqual(
          encoder.encode(text),
        );
        checked++;
      }
      if (prefix.length === 6) return;
      for (const symbol of symbols) walk([...prefix, symbol]);
    };
    walk([]);
    expect(checked).toBe(4 + 16 + 64 + 256 + 1024 + 4096);
  }, 120_000);
});

describe("lossless reconstruction", () => {
  const corpus: (string | readonly number[])[] = [
    "",
    "\uFEFF a +  b",
    "\\u0061 /* c */ \\U00000062 // t\n",
    String.raw`a "\u00e9" '\x41' b`,
    "  a § /*x*/ § b ) ] (",
    [0xef, 0xbb, 0xbf, 0x61, 0xff, 0x20, 0xe2, 0x82, 0x62, 0xf0, 0x80, 0x80],
    [0x2f, 0x2a, 0xff],
    [0x22, 0xc0, 0x22, 0x20, 0x60, 0x22],
    "((( § ]",
    "123foo 0x 1..2 a.5",
    "a\r\nb\u2028c\u0085 §",
    String.raw`\uD800 \u{zz} \U00110000 ok`,
  ];

  it.each(corpus.map((text, index) => [index, text] as const))(
    "round-trips corpus %i",
    (_index, text) => {
      const input = inputOf(text);
      const result = parseSource(input);
      expect(reconstructSource(result, input)).toEqual(input.bytes);
      expect(reconstructSource(result.root, input)).toEqual(input.bytes);
      expect(reconstructSource(result.root.structure, input)).toEqual(
        input.bytes,
      );
    },
  );

  it("walks ordered CST entries rather than echoing the input", () => {
    const input = inputOf("a /*c*/ § /*d*/ § b");
    const result = parseSource(input);
    const strippedTrivia: CstSequence = {
      ...result.root.structure,
      entries: result.root.structure.entries.filter(
        (e) => !(e.kind === "trivia"),
      ),
    };
    expect(() => reconstructSource(strippedTrivia, input)).toThrow(
      /gap|coverage|contiguous/i,
    );

    const error = result.root.structure.entries.find(
      (e) => e.kind === "error",
    )!;
    if (error.kind !== "error") throw new Error("expected error");
    const hollow = {
      ...result.root.structure,
      entries: result.root.structure.entries.map((e) =>
        e === error
          ? {
              ...error,
              components: error.components
                .filter((c) => c.kind === "error-part")
                .slice(0, 1),
            }
          : e,
      ),
    } as CstSequence;
    expect(() => reconstructSource(hollow, input)).toThrow(
      /gap|coverage|contiguous/i,
    );
    expect(() =>
      reconstructSource(result, inputOf("a /*c*/ § /*d*/ §")),
    ).toThrow();
    expect(() =>
      reconstructSource(result, inputOf("a /*c*/ § /*d*/ § b ")),
    ).toThrow(/coverage|contiguous/i);

    const first = result.root.structure.entries[0]!;
    if (first.kind !== "operand" || first.operandKind !== "token") {
      throw new Error("expected first source operand");
    }
    const overlapping: CstSequence = {
      ...result.root.structure,
      entries: result.root.structure.entries.map((entry, index) =>
        index === 0
          ? {
              ...first,
              token: {
                ...first.token,
                range: {
                  ...first.token.range,
                  bytes: { start: first.token.range.bytes.start, end: 2 },
                },
              },
            }
          : entry,
      ),
    };
    expect(() => reconstructSource(overlapping, input)).toThrow(/contiguous/i);

    const reordered: CstSequence = {
      ...result.root.structure,
      entries: [
        result.root.structure.entries[1]!,
        result.root.structure.entries[0]!,
        ...result.root.structure.entries.slice(2),
      ],
    };
    expect(() => reconstructSource(reordered, input)).toThrow(/contiguous/i);
  });

  it("includes inserted EOF closers without bytes", () => {
    const input = inputOf("(a [b");
    expect(reconstructSource(parseSource(input), input)).toEqual(input.bytes);
  });
});

describe("progress, termination and scale", () => {
  const manyComments = "/*c*/".repeat(200_000);

  it("collapses error parts across more comments than a function call can spread", () => {
    const text = `§${manyComments}§a`;
    const input = inputOf(text);
    const result = parseSource(input);
    const error = result.root.structure.entries.find(
      (entry) => entry.kind === "error",
    );
    expect(result.status).toBe("error");
    expect(shape(result.root.structure)).toEqual([
      "E:operand[§|§]",
      "APPLY",
      "a",
    ]);
    expect(result.root.expression).toBeDefined();
    expect(tree(result.root.expression!)).toBe("(APPLY E[§|§] a)");
    expect(error?.kind).toBe("error");
    if (error?.kind !== "error") throw new Error("expected collapsed error");
    expect(
      error.components.filter((component) => component.kind === "error-part"),
    ).toHaveLength(2);
    expect(
      error.components
        .filter((component) => component.kind === "error-part")
        .map(
          (component) =>
            component.kind === "error-part" && component.source.spelling,
        ),
    ).toEqual(["§", "§"]);
    expect(
      error.components.filter((component) => component.kind === "trivia"),
    ).toHaveLength(200_000);
    expect(
      error.components
        .filter((component) => component.kind === "trivia")
        .map(
          (component) =>
            component.kind === "trivia" && component.source.spelling,
        )
        .join(""),
    ).toBe(manyComments);
    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "unrecognized-character",
      "unrecognized-character",
    ]);
    expect(reconstructSource(result, input)).toEqual(input.bytes);
  }, 30_000);

  it("flushes large held trivia before a significant entry without losing source bytes", () => {
    const text = `§${manyComments}a`;
    const input = inputOf(text);
    const result = parseSource(input);
    const trivia = result.root.structure.entries.filter(
      (entry) => entry.kind === "trivia",
    );
    expect(result.status).toBe("error");
    expect(shape(result.root.structure)).toEqual([
      "E:operand[§]",
      "APPLY",
      "a",
    ]);
    expect(result.root.expression).toBeDefined();
    expect(tree(result.root.expression!)).toBe("(APPLY E[§] a)");
    expect(trivia).toHaveLength(200_000);
    expect(
      trivia
        .map((entry) => entry.kind === "trivia" && entry.source.spelling)
        .join(""),
    ).toBe(manyComments);
    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "unrecognized-character",
    ]);
    expect(reconstructSource(result, input)).toEqual(input.bytes);
  }, 30_000);

  it("flushes large held trivia at EOF without losing source bytes", () => {
    const text = `§${manyComments}`;
    const input = inputOf(text);
    const result = parseSource(input);
    const trivia = result.root.structure.entries.filter(
      (entry) => entry.kind === "trivia",
    );
    const error = result.root.structure.entries.find(
      (entry) => entry.kind === "error",
    );
    expect(result.status).toBe("error");
    expect(shape(result.root.structure)).toEqual(["E:operand[§]"]);
    expect(result.root.expression).toBeDefined();
    expect(tree(result.root.expression!)).toBe("E[§]");
    expect(error?.kind).toBe("error");
    if (error?.kind !== "error") throw new Error("expected error entry");
    expect(
      error.components
        .filter((component) => component.kind === "error-part")
        .map(
          (component) =>
            component.kind === "error-part" && component.source.spelling,
        ),
    ).toEqual(["§"]);
    expect(trivia).toHaveLength(200_000);
    expect(
      trivia
        .map((entry) => entry.kind === "trivia" && entry.source.spelling)
        .join(""),
    ).toBe(manyComments);
    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "unrecognized-character",
    ]);
    expect(reconstructSource(result, input)).toEqual(input.bytes);
  }, 30_000);

  it("handles a very long error run as one linear collapse", () => {
    const text = `a ${"§ ".repeat(50_000)}b`;
    const started = Date.now();
    const result = parse(text);
    expect(shape(result.root.structure)).toHaveLength(3);
    const error = result.root.structure.entries.find(
      (e) => e.kind === "error",
    )!;
    expect(
      error.kind === "error" &&
        error.components.filter((c) => c.kind === "error-part"),
    ).toHaveLength(50_000);
    expect(
      result.diagnostics.filter((d) => d.code === "unrecognized-character"),
    ).toHaveLength(50_000);
    expect(reconstructSource(result, inputOf(text))).toEqual(
      encoder.encode(text),
    );
    expect(Date.now() - started).toBeLessThan(20_000);
  });

  it("handles many alternating errors and deep nesting without recursion", () => {
    const alternating = `a${" § a".repeat(20_000)}`;
    const result = parse(alternating);
    let node = result.root.expression!;
    let depth = 0;
    while (node.kind === "binary") {
      node = node.left;
      depth++;
    }
    expect(depth).toBe(20_000);
    expect(reconstructSource(result, inputOf(alternating))).toEqual(
      encoder.encode(alternating),
    );

    const deep = `${"(".repeat(20_000)}§`;
    const deepResult = parse(deep);
    expect(deepResult.status).toBe("error");
    expect(reconstructSource(deepResult, inputOf(deep))).toEqual(
      encoder.encode(deep),
    );
  });
});
