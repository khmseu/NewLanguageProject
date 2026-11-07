import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseCliArguments } from "../src/cli/arguments.js";
import { readSourceFile } from "../src/cli/source-file.js";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

async function createTemporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(join(process.cwd(), ".compiler-cli-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

describe("CLI arguments", () => {
  it("returns help for a standalone --help argument", () => {
    const result = parseCliArguments(["--help"]);

    expect(result.kind).toBe("help");
    if (result.kind === "help") {
      expect(result.exitCode).toBe(0);
      expect(result.message).toMatch(/Usage:/);
      expect(result.message).toContain("--");
    }
  });

  it("accepts exactly one ordinary source path", () => {
    expect(parseCliArguments(["source file ü.lang"])).toEqual({
      kind: "file",
      path: "source file ü.lang",
    });
  });

  it("allows a leading-hyphen path after --, including a literal --help path", () => {
    expect(parseCliArguments(["--", "-source.lang"])).toEqual({
      kind: "file",
      path: "-source.lang",
    });
    expect(parseCliArguments(["--", "--help"])).toEqual({
      kind: "file",
      path: "--help",
    });
  });

  it.each([
    { label: "no arguments", args: [] },
    { label: "an unknown option", args: ["--version"] },
    { label: "a short option", args: ["-h"] },
    { label: "an empty path", args: [""] },
    { label: "a missing path after --", args: ["--"] },
    { label: "an extra path", args: ["one.lang", "two.lang"] },
    { label: "help with an extra path", args: ["--help", "one.lang"] },
    { label: "a path and extra separator", args: ["one.lang", "--"] },
  ])("returns an explicit usage failure for $label", ({ args }) => {
    const result = parseCliArguments(args);

    expect(result.kind).toBe("usage-error");
    if (result.kind === "usage-error") {
      expect(result.exitCode).toBe(2);
      expect(result.message).toMatch(/Usage:/);
      expect(result.message.length).toBeGreaterThan(0);
    }
  });

  it("explains that leading-hyphen paths require the -- separator", () => {
    const result = parseCliArguments(["-source.lang"]);

    expect(result.kind).toBe("usage-error");
    if (result.kind === "usage-error") {
      expect(result.message).toContain("--");
      expect(result.message).toContain("-source.lang");
    }
  });

  it("identifies an unknown option even when an extra argument follows", () => {
    const result = parseCliArguments(["--version", "source.lang"]);

    expect(result.kind).toBe("usage-error");
    if (result.kind === "usage-error") {
      expect(result.message).toContain("Unknown option '--version'");
    }
  });
});

describe("source-file loading", () => {
  it("loads the exact raw bytes, including malformed UTF-8 and a BOM", async () => {
    const directory = await createTemporaryDirectory();
    const path = join(directory, "source file 🧪.lang");
    const expected = new Uint8Array([
      0xef, 0xbb, 0xbf, 0x61, 0xff, 0xc3, 0x28, 0x80,
    ]);
    await writeFile(path, expected);

    const result = await readSourceFile(path);

    expect(result).toEqual({ kind: "loaded", path, bytes: expected });
  });

  it("loads an empty source file as an empty byte array", async () => {
    const directory = await createTemporaryDirectory();
    const path = join(directory, "empty.lang");
    await writeFile(path, new Uint8Array());

    const result = await readSourceFile(path);

    expect(result).toEqual({ kind: "loaded", path, bytes: new Uint8Array() });
  });

  it("returns a contextual error for a missing file", async () => {
    const directory = await createTemporaryDirectory();
    const path = join(directory, "missing.lang");

    const result = await readSourceFile(path);

    expect(result.kind).toBe("read-error");
    if (result.kind === "read-error") {
      expect(result.exitCode).toBe(2);
      expect(result.path).toBe(path);
      expect(result.message).toContain(path);
      expect(result.message).toMatch(/not found|does not exist/i);
    }
  });

  it("returns a contextual error when the path names a directory", async () => {
    const directory = await createTemporaryDirectory();
    const path = join(directory, "folder");
    await mkdir(path);

    const result = await readSourceFile(path);

    expect(result.kind).toBe("read-error");
    if (result.kind === "read-error") {
      expect(result.exitCode).toBe(2);
      expect(result.path).toBe(path);
      expect(result.message).toContain(path);
      expect(result.message).toMatch(/directory/i);
    }
  });

  it("does not convert programming errors into operational read errors", async () => {
    await expect(
      readSourceFile(undefined as unknown as string),
    ).rejects.toThrow(TypeError);
  });

});
