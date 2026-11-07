/**
 * Importable execution support for the compiler source-parse command.
 * @module
 */
import type { CstParseResult } from "../cst/cst.js";
import { parseSource } from "../parser/precedence.js";
import { SourceInput } from "../source/source-input.js";
import { parseCliArguments } from "./arguments.js";
import { readSourceFile } from "./source-file.js";

/** A destination which receives text chunks in order. */
export type CliWriter = (chunk: string) => void | Promise<void>;

/** Independent destinations for normal output and errors. */
export interface CliStreams {
  /** Receives help or the complete formatted parse result. */
  readonly stdout: CliWriter;
  /** Receives usage and source-file read errors. */
  readonly stderr: CliWriter;
}

/**
 * Run the source-parse CLI without exiting the process.
 * @param args Arguments following the executable and command.
 * @param streams Output destinations, which may be asynchronous.
 * @returns 0 for help or a complete parse, 1 for a recovered error parse, or
 * 2 for a usage or file-read error.
 * @throws If parsing or writing fails unexpectedly; no process exit is forced.
 */
export async function executeCli(
  args: readonly string[],
  streams: CliStreams,
): Promise<0 | 1 | 2> {
  const argumentsResult = parseCliArguments(args);
  if (argumentsResult.kind === "help") {
    await streams.stdout(`${argumentsResult.message}\n`);
    return 0;
  }
  if (argumentsResult.kind === "usage-error") {
    await streams.stderr(`${argumentsResult.message}\n`);
    return 2;
  }

  const file = await readSourceFile(argumentsResult.path);
  if (file.kind === "read-error") {
    await streams.stderr(`${file.message}\n`);
    return 2;
  }
  const result = parseSource(new SourceInput(file.bytes));
  await writeParseResult(result, streams.stdout);
  return result.status === "complete" ? 0 : 1;
}

/**
 * Write a complete formatted JSON parse result, followed by a newline.
 *
 * This traverses the plain result's objects and arrays iteratively; repeated
 * references are serialized each time just as with JSON.stringify. Formatting
 * can require quadratic space in the output depth, and nested shared structure
 * can multiply output size. There is no truncation or artificial size limit;
 * available time, storage and destination capacity still constrain output.
 * @param result The parse result to serialize.
 * @param write Ordered text destination, awaited between buffered chunks.
 * @returns A promise resolved when all chunks are written.
 * @throws If serialization or writing fails; partial output may already exist.
 */
export async function writeParseResult(
  result: CstParseResult,
  write: CliWriter,
): Promise<void> {
  let buffer = "";
  for (const piece of jsonPieces(result)) {
    buffer += piece;
    if (buffer.length >= 16_384) {
      await write(buffer);
      buffer = "";
    }
  }
  await write(`${buffer}\n`);
}

/** Pending value or container in the iterative JSON traversal. */
type JsonFrame =
  | {
      /** A value still to serialize. */
      readonly kind: "value";
      /** Value belonging to a plain parse-result object or array. */
      readonly value: unknown;
    }
  | {
      /** An array or ordinary object whose children are being visited. */
      readonly kind: "container";
      /** The original result container, never modified. */
      readonly value: Record<string, unknown> | readonly unknown[];
      /** Enumerable object keys, or array indices as strings. */
      readonly keys: readonly string[];
      /** Whether the container is an array. */
      readonly array: boolean;
      /** Next child index. */
      index: number;
    };

/**
 * Generate the same two-space JSON formatting as JSON.stringify for the plain
 * JSON-compatible values present in a CstParseResult, including undefined.
 * @param result Parse result to traverse.
 * @returns An iterator of JSON text fragments in document order.
 * @throws If an unsupported scalar cannot be serialized.
 */
function* jsonPieces(result: CstParseResult): Generator<string> {
  const pending: JsonFrame[] = [{ kind: "value", value: result }];
  while (pending.length > 0) {
    const frame = pending[pending.length - 1]!;
    if (frame.kind === "value") {
      pending.pop();
      const value = frame.value;
      if (value === null || typeof value !== "object") {
        const serialized = JSON.stringify(value);
        if (serialized === undefined) {
          throw new TypeError("Unsupported parse-result value");
        }
        yield serialized;
        continue;
      }

      const array = Array.isArray(value);
      const container = value as Record<string, unknown> | readonly unknown[];
      const keys = array
        ? Array.from({ length: (container as readonly unknown[]).length }, (_, index) => String(index))
        : Object.keys(container).filter(
            (key) => (container as Record<string, unknown>)[key] !== undefined,
          );
      if (keys.length === 0) {
        yield array ? "[]" : "{}";
        continue;
      }
      yield array ? "[" : "{";
      pending.push({ kind: "container", value: container, keys, array, index: 0 });
      continue;
    }

    if (frame.index === frame.keys.length) {
      pending.pop();
      yield `\n${"  ".repeat(pending.length)}${frame.array ? "]" : "}"}`;
      continue;
    }
    const key = frame.keys[frame.index]!;
    const value = (frame.value as Record<string, unknown>)[key];
    yield `${frame.index === 0 ? "" : ","}\n${"  ".repeat(pending.length)}`;
    if (!frame.array) yield `${JSON.stringify(key)}: `;
    frame.index++;
    pending.push({ kind: "value", value: frame.array && value === undefined ? null : value });
  }
}
