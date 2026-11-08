import { describe, expect, it } from "vitest";
import {
  lexCore,
  OPERATOR_PRECEDENCE,
  parseCore,
  parseSource,
  SourceInput,
  type CstExpression,
  type CstParseResult,
} from "../src/index.js";

function parse(text: string): CstParseResult {
  return parseSource(new SourceInput(new TextEncoder().encode(text)));
}

function expression(result: CstParseResult): CstExpression {
  const tree = result.root.expression;
  expect(tree, "expected a precedence tree for this input").toBeDefined();
  if (!tree) throw new Error("Missing expression tree");
  return tree;
}

function signature(node: CstExpression): string {
  switch (node.kind) {
    case "binary": {
      const operator =
        node.operator.operatorKind === "apply"
          ? "APPLY"
          : node.operator.operatorKind === "error"
            ? "ERROR"
            : node.operator.token.spelling;
      return `(${operator} ${signature(node.left)} ${signature(node.right)})`;
    }
    case "group-expression":
      return `group(${
        node.contents.expression
          ? signature(node.contents.expression)
          : "PARTIAL"
      })`;
    case "operand":
      return node.operandKind === "empty" ? "EMPTY" : node.token.spelling;
    case "error-operand":
      return `ERROR(${node.error.span.start}:${node.error.span.end})`;
  }
}

const operatorsFromTightToLoose = [
  "@",
  ".",
  "->",
  "APPLY",
  "!",
  "**",
  "*",
  "+",
  "<<",
  "&",
  "^",
  "|",
  "<",
  "==",
  "&&",
  "||",
  "<-",
  "?",
  ":",
  "=",
  ",",
  ";",
] as const;

const expectedPrecedenceLevels: readonly {
  priority: number;
  associativity: "left" | "right" | "non-associative";
  operators: readonly string[];
}[] = [
  { priority: 0, associativity: "non-associative", operators: ["@"] },
  { priority: 1, associativity: "left", operators: ["."] },
  { priority: 2, associativity: "non-associative", operators: ["->"] },
  { priority: 3, associativity: "left", operators: ["APPLY"] },
  {
    priority: 4,
    associativity: "non-associative",
    operators: ["++", "--", "!", "~"],
  },
  { priority: 5, associativity: "right", operators: ["**"] },
  { priority: 6, associativity: "left", operators: ["*", "/", "%"] },
  { priority: 7, associativity: "left", operators: ["+", "-"] },
  { priority: 8, associativity: "left", operators: ["<<", ">>"] },
  { priority: 9, associativity: "left", operators: ["&"] },
  { priority: 10, associativity: "left", operators: ["^"] },
  { priority: 11, associativity: "left", operators: ["|"] },
  {
    priority: 12,
    associativity: "left",
    operators: ["<", "<=", ">", ">="],
  },
  { priority: 13, associativity: "left", operators: ["==", "!="] },
  { priority: 14, associativity: "left", operators: ["&&"] },
  { priority: 15, associativity: "left", operators: ["||"] },
  { priority: 16, associativity: "non-associative", operators: ["<-"] },
  { priority: 17, associativity: "right", operators: ["?"] },
  { priority: 18, associativity: "right", operators: [":", "::"] },
  {
    priority: 19,
    associativity: "right",
    operators: [
      "=",
      ":=",
      "::=",
      "+=",
      "-=",
      "*=",
      "/=",
      "%=",
      "&=",
      "|=",
      "^=",
      "<<=",
      ">>=",
    ],
  },
  { priority: 20, associativity: "left", operators: [","] },
  { priority: 21, associativity: "left", operators: [";"] },
];

function operandsWith(operators: readonly string[]): string {
  let source = "a";
  for (const [index, operator] of operators.entries()) {
    const operand = String.fromCharCode("b".charCodeAt(0) + index);
    source += operator === "APPLY" ? ` ${operand}` : ` ${operator} ${operand}`;
  }
  return source;
}

describe("precedence-based binary CST (DEC-021/022/066/068/069/072/073/074/076/088/093)", () => {
  it("publishes every approved operator, priority, and level associativity", () => {
    const levels = new Map<
      number,
      {
        associativity: "left" | "right" | "non-associative";
        operators: string[];
      }
    >();
    for (const [operator, binding] of Object.entries(OPERATOR_PRECEDENCE)) {
      const current = levels.get(binding.priority) ?? {
        associativity: binding.associativity,
        operators: [],
      };
      current.operators.push(operator);
      levels.set(binding.priority, current);
    }

    expect(
      [...levels.entries()].map(([priority, level]) => ({
        priority,
        associativity: level.associativity,
        operators: level.operators.sort(),
      })),
    ).toEqual(
      expectedPrecedenceLevels.map((level) => ({
        ...level,
        operators: [...level.operators].sort(),
      })),
    );
  });

  it.each(
    operatorsFromTightToLoose
      .slice(0, -1)
      .map(
        (operator, index) =>
          [operator, operatorsFromTightToLoose[index + 1]!] as const,
      ),
  )(
    "uses each adjacent precedence boundary: %s before %s",
    (tighter, looser) => {
      const result = parse(operandsWith([tighter, looser]));
      expect(result.status).toBe("complete");
      expect(signature(expression(result))).toBe(
        `(${looser} (${tighter} a b) c)`,
      );
    },
  );

  it("binds APPLY between -> and the prefix/postfix operator level", () => {
    expect(signature(expression(parse("a b -> c")))).toBe(
      "(APPLY a (-> b c))",
    );
    expect(signature(expression(parse("a b ! c")))).toBe(
      "(! (APPLY a b) c)",
    );
  });

  it("uses left associativity for ordinary levels and implicit APPLY", () => {
    expect(signature(expression(parse("a - b - c")))).toBe("(- (- a b) c)");
    expect(signature(expression(parse("a b c")))).toBe("(APPLY (APPLY a b) c)");
    expect(signature(expression(parse("a,b,c")))).toBe("(, (, a b) c)");
    expect(signature(expression(parse("a;b;c")))).toBe("(; (; a b) c)");
    expect(signature(expression(parse("")))).toBe("EMPTY");
  });

  it("uses right associativity for exponentiation, binding, and colon levels", () => {
    expect(signature(expression(parse("a ** b ** c")))).toBe("(** a (** b c))");
    expect(signature(expression(parse("a = b = c")))).toBe("(= a (= b c))");
    expect(signature(expression(parse("a : b :: c")))).toBe("(: a (:: b c))");
  });

  it("diagnoses mixed non-associative operators while retaining a deterministic tree", () => {
    const result = parse("a ++ b -- c");
    expect(result.status).toBe("error");
    expect(signature(expression(result))).toBe("(-- (++ a b) c)");
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      "non-associative-operator-chain",
    ]);
    expect(result.diagnostics[0]).toMatchObject({
      operator: "--",
      location: { start: 7, end: 9 },
    });

    const arrows = parse("a -> b -> c");
    expect(arrows.status).toBe("error");
    expect(arrows.diagnostics.map(({ code }) => code)).toEqual([
      "non-associative-operator-chain",
    ]);

    for (const source of ["a @ b @ c", "a <- b <- c"]) {
      const chained = parse(source);
      expect(chained.status).toBe("error");
      expect(chained.diagnostics.map(({ code }) => code)).toEqual([
        "non-associative-operator-chain",
      ]);
    }
  });

  it("treats a group as an operand and parses its interior independently", () => {
    const result = parse("a * (b + c)");
    expect(signature(expression(result))).toBe("(* a group((+ b c)))");
    const parsedGroup = expression(result);
    if (
      parsedGroup.kind !== "binary" ||
      parsedGroup.right.kind !== "group-expression"
    ) {
      throw new Error("Expected a grouped right operand");
    }
    expect(parsedGroup.right.span).toEqual({ start: 4, end: 11 });
    expect(parsedGroup.right.close.span).toEqual({ start: 10, end: 11 });
  });

  it("models prefix/postfix spellings with inserted EMPTY operands, not unary grammar", () => {
    expect(signature(expression(parse("-a")))).toBe("(- EMPTY a)");

    const productThenMinus = parse("a * -b");
    expect(signature(expression(productThenMinus))).toBe("(- (* a EMPTY) b)");

    const bangIncrement = parse("!a++");
    expect(signature(expression(bangIncrement))).toBe("(++ (! EMPTY a) EMPTY)");
    expect(bangIncrement.status).toBe("error");
    expect(bangIncrement.diagnostics.map(({ code }) => code)).toEqual([
      "non-associative-operator-chain",
    ]);
  });

  it("keeps conditional, sequence, list, and language forms as generic operators", () => {
    expect(signature(expression(parse("a ? b : c")))).toBe("(: (? a b) c)");
    expect(signature(expression(parse("a ? b : c ? d : e")))).toBe(
      "(: (? a b) (: (? c d) e))",
    );
    expect(signature(expression(parse("a,b,c;d")))).toBe("(; (, (, a b) c) d)");
    expect(signature(expression(parse("@name := value")))).toBe(
      "(:= (@ EMPTY name) value)",
    );
    expect(signature(expression(parse("function(x) -> y")))).toBe(
      "(APPLY function (-> group(x) y))",
    );
  });

  it("accepts reserved :: structurally without assigning semantic legality", () => {
    const result = parse("a :: b");
    expect(result.status).toBe("complete");
    expect(result.diagnostics).toEqual([]);
    expect(signature(expression(result))).toBe("(:: a b)");
  });

  it("retains operator provenance, UTF-8 byte spans, comments, and trivia", () => {
    const source = "é /*keep*/ + 名";
    const result = parse(source);
    const tree = expression(result);
    expect(result.root.span).toEqual({ start: 0, end: 17 });
    expect(tree.span).toEqual({ start: 0, end: 17 });
    if (tree.kind !== "binary") throw new Error("Expected a binary root");
    expect(tree.operator.span).toEqual({ start: 12, end: 13 });
    expect(tree.left.span).toEqual({ start: 0, end: 2 });
    expect(tree.right.span).toEqual({ start: 14, end: 17 });
    expect(
      result.root.structure.entries
        .filter((entry) => entry.kind === "trivia")
        .map((entry) => entry.source.spelling),
    ).toContain("/*keep*/");

    const sourceInput = new SourceInput(new TextEncoder().encode("a + b"));
    const viaLexedTokens = parseCore(lexCore(sourceInput));
    expect(signature(expression(viaLexedTokens))).toBe("(+ a b)");
    expect(viaLexedTokens.root.expression?.span).toEqual({ start: 0, end: 5 });
  });

  it("retains structural errors with a full tree and error status", () => {
    const unexpected = parse("a)");
    expect(unexpected.status).toBe("error");
    expect(signature(expression(unexpected))).toBe("(APPLY a ERROR(1:2))");
    expect(unexpected.root.structure.entries.map(({ kind }) => kind)).toEqual([
      "operand",
      "operator",
      "error",
    ]);
    expect(unexpected.diagnostics.map(({ code }) => code)).toEqual([
      "unexpected-closing-delimiter",
    ]);

    const missing = parse("(a");
    expect(missing.status).toBe("error");
    expect(signature(expression(missing))).toBe("group(a)");
    const group = expression(missing);
    if (group.kind !== "group-expression") throw new Error("Expected group");
    expect(group.close).toMatchObject({
      spelling: ")",
      synthetic: true,
      span: { start: 2, end: 2 },
    });
    expect(missing.diagnostics.map(({ code }) => code)).toEqual([
      "missing-closing-delimiter",
    ]);
  });

  it("collapses lexer errors but keeps every diagnostic and never succeeds", () => {
    const result = parse("a § § b");
    expect(result.status).toBe("error");
    expect(signature(expression(result))).toBe("(ERROR a b)");
    expect(
      result.root.structure.entries.filter(({ kind }) => kind === "error"),
    ).toHaveLength(1);
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      "unrecognized-character",
      "unrecognized-character",
    ]);
  });

  it("allows a non-associative operator inside an independent group", () => {
    const grouped = parse("(a ++ b) ++ c");
    expect(grouped.status).toBe("complete");
    expect(grouped.diagnostics).toEqual([]);
    expect(signature(expression(grouped))).toBe("(++ group((++ a b)) c)");
  });

  it("parses deeply nested groups without overflowing the call stack", () => {
    const levels = 1_500;
    const result = parse(`${"(".repeat(levels)}a${")".repeat(levels)}`);

    expect(result.status).toBe("complete");
    expect(result.diagnostics).toEqual([]);

    let node = expression(result);
    let actualLevels = 0;
    while (node.kind === "group-expression") {
      actualLevels += 1;
      const inner = node.contents.expression;
      expect(
        inner,
        "each nested group should have an expression",
      ).toBeDefined();
      if (!inner) throw new Error("Missing nested group expression");
      node = inner;
    }

    expect(actualLevels).toBe(levels);
    expect(node.kind).toBe("operand");
    if (node.kind !== "operand") throw new Error("Expected innermost operand");
    expect(node.operandKind).toBe("token");
    if (node.operandKind !== "token") throw new Error("Expected token operand");
    expect(node.token.spelling).toBe("a");
  });

  it("parses long left-associative chains with exact iterative depth", () => {
    const operatorCount = 5_000;
    const result = parse(
      Array(operatorCount + 1)
        .fill("a")
        .join(" + "),
    );

    expect(result.status).toBe("complete");
    expect(result.diagnostics).toEqual([]);

    let node = expression(result);
    let actualOperators = 0;
    while (node.kind === "binary") {
      expect(node.operator.operatorKind).toBe("explicit");
      if (node.operator.operatorKind !== "explicit") {
        throw new Error("Expected an explicit operator");
      }
      expect(node.operator.token.spelling).toBe("+");
      expect(node.right.kind).toBe("operand");
      if (node.right.kind !== "operand")
        throw new Error("Expected right operand");
      expect(node.right.operandKind).toBe("token");
      if (node.right.operandKind !== "token") {
        throw new Error("Expected right token operand");
      }
      expect(node.right.token.spelling).toBe("a");
      actualOperators += 1;
      node = node.left;
    }

    expect(actualOperators).toBe(operatorCount);
    expect(node.kind).toBe("operand");
    if (node.kind !== "operand") throw new Error("Expected leftmost operand");
    expect(node.operandKind).toBe("token");
    if (node.operandKind !== "token") throw new Error("Expected token operand");
    expect(node.token.spelling).toBe("a");
  });

  it("parses long right-associative chains with exact iterative depth", () => {
    const operatorCount = 5_000;
    const result = parse(
      Array(operatorCount + 1)
        .fill("a")
        .join(" ** "),
    );

    expect(result.status).toBe("complete");
    expect(result.diagnostics).toEqual([]);

    let node = expression(result);
    let actualOperators = 0;
    while (node.kind === "binary") {
      expect(node.operator.operatorKind).toBe("explicit");
      if (node.operator.operatorKind !== "explicit") {
        throw new Error("Expected an explicit operator");
      }
      expect(node.operator.token.spelling).toBe("**");
      expect(node.left.kind).toBe("operand");
      if (node.left.kind !== "operand")
        throw new Error("Expected left operand");
      expect(node.left.operandKind).toBe("token");
      if (node.left.operandKind !== "token") {
        throw new Error("Expected left token operand");
      }
      expect(node.left.token.spelling).toBe("a");
      actualOperators += 1;
      node = node.right;
    }

    expect(actualOperators).toBe(operatorCount);
    expect(node.kind).toBe("operand");
    if (node.kind !== "operand") throw new Error("Expected rightmost operand");
    expect(node.operandKind).toBe("token");
    if (node.operandKind !== "token") throw new Error("Expected token operand");
    expect(node.token.spelling).toBe("a");
  });
});
