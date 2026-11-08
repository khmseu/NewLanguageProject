import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { executeCli, writeParseResult } from "../src/cli/execute.js";
import type { CstParseResult } from "../src/cst/cst.js";
import { parseSource } from "../src/parser/precedence.js";
import { SourceInput } from "../src/source/source-input.js";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

async function sourceFile(bytes: Uint8Array): Promise<string> {
  const directory = await mkdtemp(join(process.cwd(), ".cli-execution-test-"));
  temporaryDirectories.push(directory);
  const path = join(directory, "source.lang");
  await writeFile(path, bytes);
  return path;
}

async function run(args: readonly string[]) {
  let stdout = "";
  let stderr = "";
  const code = await executeCli(args, {
    stdout: async (chunk) => {
      stdout += chunk;
    },
    stderr: (chunk) => {
      stderr += chunk;
    },
  });
  return { code, stdout, stderr };
}

describe("importable CLI execution", () => {
  it.each(["", "()", "[]", "{}"])(
    "represents empty scopes without source metadata: %j",
    async (source) => {
      const result = await run([
        "--reduced-json", await sourceFile(Buffer.from(source)),
      ]);
      const empty = { tokenKind: "empty", spelling: "EMPTY" };
      expect(JSON.parse(result.stdout)).toEqual({
        root: source === "" ? empty : { delimiter: source[0], expression: empty },
        diagnostics: [],
        status: "complete",
      });
    },
  );

  it("preserves complete groups recovered with missing closers", async () => {
    const bytes = Buffer.from("(a");
    const result = await run(["--reduced-json", await sourceFile(bytes)]);
    const expected = parseSource(new SourceInput(bytes));
    expect(result.code).toBe(1);
    expect(JSON.parse(result.stdout)).toEqual({
      root: expected.root.expression,
      diagnostics: expected.diagnostics,
      status: "error",
    });
  });

  it("reduces operators, tokens, groups and EMPTY to their exact requested fields", async () => {
    const path = await sourceFile(Buffer.from("f /* omit */ (a + 2);"));
    const result = await run(["--reduced-json", path]);
    expect(result.code).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      root: {
        left: {
          left: { tokenKind: "identifier", spelling: "f" },
          right: {
            delimiter: "(",
            expression: {
              left: { tokenKind: "identifier", spelling: "a" },
              right: { tokenKind: "number", spelling: "2" },
              spelling: "+",
            },
          },
          spelling: "APPLY",
        },
        right: { tokenKind: "empty", spelling: "EMPTY" },
        spelling: ";",
      },
      diagnostics: [],
      status: "complete",
    });
  });

  it.each(["0x", "a § b", "([a)]", "a -> b -> c"])(
    "keeps diagnostics and error nodes complete for %s",
    async (source) => {
      const bytes = Buffer.from(source);
      const expected = parseSource(new SourceInput(bytes));
      const result = await run(["--reduced-json", await sourceFile(bytes)]);
      expect(result.code).toBe(1);
      expect(result.stderr).toBe("");
      const reduced = JSON.parse(result.stdout);
      expect(reduced.diagnostics).toEqual(expected.diagnostics);
      expect(reduced.status).toBe("error");
      const originalErrors: unknown[] = [];
      const pending = [expected.root.expression];
      while (pending.length) {
        const node = pending.pop();
        if (!node) continue;
        if (node.kind === "error-operand") originalErrors.push(node);
        else if (node.kind === "binary") {
          if (node.operator.operatorKind === "error") originalErrors.push(node);
          else pending.push(node.left, node.right);
        } else if (node.kind === "group-expression") {
          pending.push(node.contents.expression);
        }
      }
      for (const error of originalErrors) {
        const allObjects: unknown[] = [];
        const queue: unknown[] = [reduced.root];
        while (queue.length) {
          const value = queue.pop();
          if (value !== null && typeof value === "object") {
            allObjects.push(value);
            queue.push(...Object.values(value));
          }
        }
        expect(allObjects).toContainEqual(error);
      }
    },
  );

  it("writes standalone help only to stdout", async () => {
    const result = await run(["--help"]);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Usage: parse");
    expect(result.stderr).toBe("");
  });

  it.each([[], ["--unknown"], ["first", "second"]])(
    "reports invalid arguments %j only on stderr",
    async (...args) => {
      const result = await run(args);
      expect(result.code).toBe(2);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("Usage:");
    },
  );

  it("reports missing files and directories only on stderr", async () => {
    const path = await sourceFile(new Uint8Array());
    for (const badPath of [`${path}-missing`, join(path, "..")]) {
      const result = await run([badPath]);
      expect(result.code).toBe(2);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("Unable to read source file");
      expect(result.stderr).toContain(badPath);
    }
  });

  // DEC-069/071/075: trivia, recovery, and malformed bytes remain in the result.
  it.each([
    {
      name: "valid with comments and escaping",
      bytes: Buffer.from('alpha /* comment */ + "a\\n"'),
      status: "complete",
    },
    { name: "empty", bytes: Buffer.from(""), status: "complete" },
    {
      name: "nested groups",
      bytes: Buffer.from("((((((a))))))"),
      status: "complete",
    },
    {
      name: "recovered syntax",
      bytes: Buffer.from("(alpha + ]"),
      status: "error",
    },
    {
      name: "malformed UTF-8",
      bytes: Uint8Array.of(0x61, 0x20, 0xff, 0x62),
      status: "error",
    },
    {
      name: "malformed Unicode escape",
      bytes: Buffer.from("\\u00ZZ"),
      status: "error",
    },
  ])(
    "outputs the exact full parser result for $name",
    async ({ bytes, status }) => {
      const path = await sourceFile(bytes);
      const expected = parseSource(new SourceInput(bytes));
      const result = await run([path]);
      expect(expected.status).toBe(status);
      expect(result.code).toBe(status === "complete" ? 0 : 1);
      expect(result.stderr).toBe("");
      expect(result.stdout).toBe(`${JSON.stringify(expected, null, 2)}\n`);
      const parsed: unknown = JSON.parse(result.stdout);
      expect(parsed).toEqual(expected);
      expect(Object.keys(parsed as object)).toEqual([
        "root",
        "diagnostics",
        "status",
      ]);
      if (expected.status === "error") {
        expect(expected.diagnostics.length).toBeGreaterThan(0);
        expect(expected.root.structure.entries.length).toBeGreaterThan(0);
      }
    },
  );

  it("retains trivia and recovered delimiter diagnostics in the JSON", async () => {
    const valid = await run([
      await sourceFile(Buffer.from("a /* kept */ + b")),
    ]);
    const parsedValid = JSON.parse(valid.stdout) as CstParseResult;
    expect(
      parsedValid.root.structure.entries.some(
        (entry) => entry.kind === "trivia",
      ),
    ).toBe(true);
    expect(valid.stdout).toContain("/* kept */");

    const invalid = await run([await sourceFile(Buffer.from("(a + ]"))]);
    const parsedInvalid = JSON.parse(invalid.stdout) as CstParseResult;
    expect(parsedInvalid.root.structure.entries[0]?.kind).toBe("group");
    expect(
      parsedInvalid.diagnostics.map((diagnostic) => diagnostic.code),
    ).toEqual(["unexpected-closing-delimiter", "missing-closing-delimiter"]);
    expect(parsedInvalid.root.expression).toBeDefined();
  });

  it("propagates destination failures instead of reporting success", async () => {
    const failure = new Error("write failed");
    await expect(
      executeCli(["--help"], {
        stdout: () => {
          throw failure;
        },
        stderr: () => {},
      }),
    ).rejects.toBe(failure);
    await expect(
      executeCli([], {
        stdout: () => {},
        stderr: async () => {
          throw failure;
        },
      }),
    ).rejects.toBe(failure);
    const path = await sourceFile(Buffer.from("a"));
    await expect(
      executeCli([path], {
        stdout: async () => {
          throw failure;
        },
        stderr: () => {},
      }),
    ).rejects.toBe(failure);
  });

  it("streams a real long operator chain without truncation", async () => {
    const bytes = Buffer.from(
      Array.from({ length: 1_200 }, () => "a").join("+"),
    );
    const path = await sourceFile(bytes);
    let length = 0;
    let tail = "";
    let chunks = 0;
    let matchingTail = "";
    let binaries = 0;
    const code = await executeCli([path], {
      stdout: (chunk) => {
        length += chunk.length;
        tail = (tail + chunk).slice(-200);
        chunks++;
        const combined = matchingTail + chunk;
        binaries += combined.split('"kind": "binary"').length - 1;
        matchingTail = combined.slice(-'"kind": "binary"'.length + 1);
      },
      stderr: () => {
        throw new Error("unexpected stderr");
      },
    });
    expect(code).toBe(0);
    expect(length).toBeGreaterThan(1_000_000);
    expect(chunks).toBeGreaterThan(1);
    expect(binaries).toBe(1_199);
    expect(tail).toContain('"status": "complete"');
    expect(tail.endsWith("}\n")).toBe(true);
  }, 30_000);
});

describe("stack-safe parse-result JSON", () => {
  it("streams a deep reduced tree without changing the original CST", async () => {
    const result = parseSource(new SourceInput(Buffer.from(
      Array.from({ length: 1_500 }, () => "a").join("+"),
    )));
    const originalRoot = result.root.expression;
    let operators = 0;
    let matchingTail = "";
    let tail = "";
    let chunks = 0;
    await writeParseResult(result, (chunk) => {
      chunks++;
      const combined = matchingTail + chunk;
      operators += combined.split('"spelling": "+"').length - 1;
      matchingTail = combined.slice(-'"spelling": "+"'.length + 1);
      tail = (tail + chunk).slice(-100);
      expect(chunk).not.toContain('"structure"');
    }, true);
    expect(operators).toBe(1_499);
    expect(chunks).toBeGreaterThan(1);
    expect(tail).toContain('"status": "complete"');
    expect(tail.endsWith("}\n")).toBe(true);
    expect(result.root.expression).toBe(originalRoot);
    expect(originalRoot?.kind).toBe("binary");
    expect(result.root.structure.entries.length).toBeGreaterThan(1_500);
  }, 30_000);

  it("matches native formatting including undefined and escaped strings", async () => {
    const result = {
      root: {
        structure: { entries: [undefined, 'quote" slash\\\n', null] },
        expression: undefined,
      },
      diagnostics: [],
      status: "complete",
    } as unknown as CstParseResult;
    let output = "";
    await writeParseResult(result, (chunk) => {
      output += chunk;
    });
    expect(output).toBe(`${JSON.stringify(result, null, 2)}\n`);
  });

  it("serializes a 2,000-level linear result without truncation", async () => {
    let expression: unknown = { kind: "leaf-marker" };
    for (let index = 0; index < 2_000; index++) {
      expression = { kind: "branch", left: expression };
    }
    const result = {
      root: { expression },
      diagnostics: [],
      status: "complete",
    } as unknown as CstParseResult;
    let length = 0;
    let branches = 0;
    let leaves = 0;
    let tail = "";
    let matchingTail = "";
    await writeParseResult(result, (chunk) => {
      length += chunk.length;
      const combined = matchingTail + chunk;
      branches += combined.split('"kind": "branch"').length - 1;
      leaves += combined.split("leaf-marker").length - 1;
      matchingTail = combined.slice(-'"kind": "branch"'.length + 1);
      tail = (tail + chunk).slice(-100);
    });
    expect(length).toBeGreaterThan(1_000_000);
    expect(branches).toBe(2_000);
    expect(leaves).toBe(1);
    expect(tail).toContain('"status": "complete"');
    expect(tail.endsWith("}\n")).toBe(true);
  }, 30_000);
});
