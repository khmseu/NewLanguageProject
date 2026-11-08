/**
 * Stack-safe, display-only projection of the lossless CST for CLI JSON output.
 * @module
 */
import type { CstExpression, CstParseResult } from "../cst/cst.js";

/** JSON projection or a complete original error/recovery node. */
type ReducedExpression =
  | CstExpression
  | {
      /** Reduced left argument. */
      readonly left: ReducedExpression;
      /** Reduced right argument. */
      readonly right: ReducedExpression;
      /** Explicit operator spelling or APPLY. */
      readonly spelling: string;
    }
  | {
      /** Opening delimiter spelling; the pair is implied. */
      readonly delimiter: string;
      /** Independently reduced group contents. */
      readonly expression: ReducedExpression;
    }
  | {
      /** Lexer token category, or empty for a synthetic EMPTY. */
      readonly tokenKind: string;
      /** Source token spelling, or EMPTY. */
      readonly spelling: string;
    };

/**
 * Project only expression trees while retaining diagnostics and error status.
 * Error operands, error-operator binary nodes, and groups with missing closers
 * or absent expressions remain complete, including their original descendants.
 * An absent root expression retains its full parsed scope instead of hiding
 * recovery data. Ordinary trivia and duplicated structural sequences are omitted.
 * @param result Original parser result, never mutated.
 * @returns A display envelope; this projection is not a lossless CST.
 * @throws If an internally scheduled child projection is missing.
 */
export function reduceParseResult(result: CstParseResult) {
  const root = result.root.expression;
  if (root === undefined) {
    return {
      root: result.root,
      diagnostics: result.diagnostics,
      status: result.status,
    };
  }
  const reduced = new Map<CstExpression, ReducedExpression>();
  const pending: { node: CstExpression; visited: boolean }[] = [
    { node: root, visited: false },
  ];

  /**
   * Retrieve an already projected child after post-order traversal.
   * @param node Original expression.
   * @returns Its reduced or preserved representation.
   * @throws If traversal did not schedule the child.
   */
  function child(node: CstExpression): ReducedExpression {
    const value = reduced.get(node);
    if (value === undefined) throw new Error("Missing reduced CST child");
    return value;
  }

  while (pending.length > 0) {
    const { node, visited } = pending.pop()!;
    if (
      node.kind === "error-operand" ||
      (node.kind === "binary" && node.operator.operatorKind === "error") ||
      (node.kind === "group-expression" &&
        (node.close.synthetic || node.contents.expression === undefined))
    ) {
      reduced.set(node, node);
    } else if (node.kind === "operand") {
      reduced.set(
        node,
        node.operandKind === "empty"
          ? { tokenKind: "empty", spelling: "EMPTY" }
          : { tokenKind: node.token.tokenKind, spelling: node.token.spelling },
      );
    } else if (!visited) {
      pending.push({ node, visited: true });
      if (node.kind === "binary") {
        pending.push(
          { node: node.right, visited: false },
          { node: node.left, visited: false },
        );
      } else if (node.kind === "group-expression" && node.contents.expression) {
        pending.push({ node: node.contents.expression, visited: false });
      }
    } else if (
      node.kind === "binary" && node.operator.operatorKind !== "error"
    ) {
      reduced.set(node, {
        left: child(node.left),
        right: child(node.right),
        spelling:
          node.operator.operatorKind === "apply"
            ? "APPLY"
            : node.operator.token.spelling,
      });
    } else if (node.kind === "group-expression" && node.contents.expression) {
      reduced.set(node, {
        delimiter: node.open.spelling,
        expression: child(node.contents.expression),
      });
    }
  }
  return {
    root: child(root),
    diagnostics: result.diagnostics,
    status: result.status,
  };
}
