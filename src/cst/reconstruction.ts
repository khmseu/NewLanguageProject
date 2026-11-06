/**
 * Exact byte reconstruction from the ordered entries of a lossless CST.
 * @module
 */
import type { ByteRange, SourceInput } from "../source/source-input.js";
import type {
  CoreStructureResult,
  CstEntry,
  CstParsedSequence,
  CstParseResult,
  CstSequence,
} from "./cst.js";

/** A scope being walked, with the closer to emit when its entries end. */
interface Walk {
  /** Entries of the scope, in source order. */
  readonly entries: readonly CstEntry[];
  /** Next entry to visit. */
  index: number;
  /** Source closer to emit after the entries; absent for roots and EOF closers. */
  readonly close?: ByteRange;
}

/**
 * Rebuild the original bytes by walking the CST's ordered source entries
 * (trivia, tokens, error parts, group delimiters) and copying each entry's own
 * byte range out of the owned `SourceInput`. Inserted `APPLY`, `EMPTY` and EOF
 * closers contribute no bytes. The walk is iterative, so nesting depth does not
 * consume the call stack, and it runs in time linear in the entry count.
 * @param tree - A parse result, parsed scope, structure result, or sequence.
 * @param input - The exact input the tree was parsed from.
 * @returns A fresh array equal to the input only if the entries cover every
 * byte exactly once, in order.
 * @throws {Error} If entries leave a gap, overlap, reorder bytes, or end before EOF.
 * @throws {RangeError} If an entry range lies outside the input.
 */
export function reconstructSource(
  tree: CstParseResult | CstParsedSequence | CoreStructureResult | CstSequence,
  input: SourceInput,
): Uint8Array {
  const root = rootSequence(tree);
  const output = new Uint8Array(input.byteLength);
  let cursor = 0;
  const emit = (range: ByteRange): void => {
    if (range.start !== cursor) {
      throw new Error(
        `CST entries are not contiguous: expected byte ${cursor} but found ${range.start}.`,
      );
    }
    output.set(input.slice(range), cursor);
    cursor = range.end;
  };

  const stack: Walk[] = [{ entries: root.entries, index: 0 }];
  while (stack.length > 0) {
    const walk = stack[stack.length - 1]!;
    if (walk.index === walk.entries.length) {
      stack.pop();
      if (walk.close) emit(walk.close);
      continue;
    }
    const entry = walk.entries[walk.index++]!;
    switch (entry.kind) {
      case "trivia":
        emit(entry.source.range.bytes);
        break;
      case "operand":
        if (entry.operandKind === "token") emit(entry.token.range.bytes);
        break;
      case "operator":
        if (entry.operatorKind === "explicit") emit(entry.token.range.bytes);
        break;
      case "error":
        for (const component of entry.components) {
          emit(component.source.range.bytes);
        }
        break;
      case "group":
        emit(entry.open.range.bytes);
        stack.push({
          entries: entry.contents.entries,
          index: 0,
          ...(entry.close.token ? { close: entry.close.token.range.bytes } : {}),
        });
        break;
    }
  }
  if (cursor !== input.byteLength) {
    throw new Error(
      `CST entries are not contiguous: coverage ends at byte ${cursor} of ${input.byteLength}.`,
    );
  }
  return output;
}

/**
 * Locate the lossless structural root in any accepted tree shape.
 * @param tree - Parse result, parsed scope, structure result, or sequence.
 * @returns The structural file scope.
 */
function rootSequence(
  tree: CstParseResult | CstParsedSequence | CoreStructureResult | CstSequence,
): CstSequence {
  if ("entries" in tree) return tree;
  if ("structure" in tree) return tree.structure;
  return "structure" in tree.root ? tree.root.structure : tree.root;
}
