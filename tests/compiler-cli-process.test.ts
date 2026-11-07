import { spawn } from "node:child_process";
import { realpathSync, statSync } from "node:fs";
import { chmod, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { Writable } from "node:stream";
import { basename, delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { writeNodeStream } from "../src/cli/stream-writer.js";

/** Project root used for the built CLI and project-local test scratch data. */
const PROJECT_ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
/** Compiled entry path produced by the package build. */
const BUILT_ENTRY = join(PROJECT_ROOT, "dist", "cli", "main.js");

let temporaryDirectory: string;

/**
 * Selects Node and npm's real CLI script, never a shell or .cmd shim.
 *
 * npm supplies npm_execpath for lifecycle scripts. Standalone Vitest runs
 * instead discover standard npm installations next to Node or on PATH,
 * including Unix npm symlinks and Windows node_modules/npm layouts.
 *
 * @param args Literal npm arguments, kept as separate argv entries.
 * @param npmExecPath Preferred lifecycle script path, validated before use.
 * @param searchDirectories Node/PATH directories to inspect as a fallback.
 * @returns The Node executable and arguments beginning with npm-cli.js.
 * @throws If no regular npm-cli.js file can be found.
 */
function npmInvocation(
  args: readonly string[],
  npmExecPath = process.env.npm_execpath,
  searchDirectories: readonly string[] = [
    dirname(process.execPath),
    ...(process.env.PATH ?? "").split(delimiter).filter(Boolean),
  ],
): { command: string; args: string[] } {
  const candidates = [
    ...(npmExecPath ? [npmExecPath] : []),
    ...searchDirectories.flatMap((directory) => [
      join(directory, "node_modules", "npm", "bin", "npm-cli.js"),
      join(directory, "..", "lib", "node_modules", "npm", "bin", "npm-cli.js"),
      join(directory, "npm"),
    ]),
  ];
  for (const candidate of candidates) {
    let script: string;
    try {
      script = realpathSync(candidate);
      if (basename(script) !== "npm-cli.js" || !statSync(script).isFile()) {
        continue;
      }
    } catch {
      continue;
    }
    return { command: process.execPath, args: [script, ...args] };
  }
  throw new Error(
    "Cannot locate npm-cli.js; run via npm test or install npm beside Node/on PATH.",
  );
}

/** Runs npm using the selected executable and argument vector. */
function runNpm(args: readonly string[]) {
  const invocation = npmInvocation(args);
  return runProcess(invocation.command, invocation.args);
}

/**
 * Spawns a command and consumes both pipes as bytes until the process closes.
 *
 * @param command Executable to start.
 * @param args Arguments passed without shell interpretation.
 * @returns The exit status, stdout bytes and stderr bytes.
 * @throws If the child process cannot be started.
 */
function runProcess(
  command: string,
  args: readonly string[],
): Promise<{
  readonly code: number | null;
  readonly stdout: Buffer;
  readonly stderr: Buffer;
}> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, [...args], {
      cwd: PROJECT_ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.once("error", reject);
    child.once("close", (code) =>
      resolvePromise({
        code,
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr),
      }),
    );
  });
}

/**
 * Runs the emitted CLI directly, without invoking npm's script output.
 *
 * @param args Arguments following the script path.
 * @returns The process result with both output streams drained.
 * @throws If Node cannot be started.
 */
function runBuiltCli(args: readonly string[]) {
  return runProcess(process.execPath, [BUILT_ENTRY, ...args]);
}

/**
 * Parses stdout from a successful JSON invocation.
 *
 * @param stdout The child process stdout bytes.
 * @returns The parsed complete compiler result.
 * @throws If stdout is not valid JSON.
 */
function parseJson(stdout: Buffer): Record<string, unknown> {
  return JSON.parse(stdout.toString("utf8")) as Record<string, unknown>;
}

beforeAll(async () => {
  const build = await runNpm(["run", "--silent", "build"]);
  expect(build.code, build.stderr.toString("utf8")).toBe(0);
  temporaryDirectory = await mkdtemp(join(PROJECT_ROOT, ".tmp-cli-process-"));
});

afterAll(async () => {
  if (temporaryDirectory !== undefined) {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

describe("runnable compiler CLI", () => {
  it("selects Node and a validated npm CLI script, preserving literal arguments", async () => {
    const npmCli = join(temporaryDirectory, "npm-cli.js");
    await writeFile(npmCli, "// npm CLI selection fixture\n");
    const args = ["--silent", "run", "parse", "--", "來源 with spaces & %.src"];

    expect(npmInvocation(args, npmCli, [])).toEqual({
      command: process.execPath,
      args: [npmCli, ...args],
    });
  });

  it("discovers an installed npm CLI instead of executing a .cmd shim", async () => {
    const directory = join(temporaryDirectory, "node with spaces");
    const npmBin = join(directory, "node_modules", "npm", "bin");
    await mkdir(npmBin, { recursive: true });
    const npmCli = join(npmBin, "npm-cli.js");
    await writeFile(npmCli, "// npm CLI selection fixture\n");
    const shim = join(directory, "npm.cmd");
    await writeFile(shim, "@echo off\n");

    expect(npmInvocation(["--version"], shim, [directory])).toEqual({
      command: process.execPath,
      args: [npmCli, "--version"],
    });
    expect(npmInvocation(["--version"], "", [directory])).toEqual({
      command: process.execPath,
      args: [npmCli, "--version"],
    });
  });

  it("rejects missing scripts, directories and unrelated JavaScript launchers", async () => {
    const unrelated = join(temporaryDirectory, "other-cli.js");
    await writeFile(unrelated, "// not npm\n");
    const directory = join(temporaryDirectory, "directory", "npm-cli.js");
    await mkdir(directory, { recursive: true });
    for (const candidate of [
      join(temporaryDirectory, "missing", "npm-cli.js"),
      directory,
      unrelated,
    ]) {
      expect(() => npmInvocation([], candidate, [])).toThrow(
        "Cannot locate npm-cli.js",
      );
    }
  });

  it("prints help through the actual npm command without script banners", async () => {
    const result = await runNpm(["--silent", "run", "parse", "--", "--help"]);

    expect(result.code).toBe(0);
    expect(result.stdout.toString("utf8")).toMatch(
      /^Usage: parse \[--help\] \[--\] <source-file>/,
    );
    expect(result.stderr).toHaveLength(0);
  }, 15_000);

  it("awaits stream backpressure and propagates output errors", async () => {
    let releaseWrite: (() => void) | undefined;
    const slowStream = new Writable({
      highWaterMark: 1,
      write(_chunk, _encoding, callback) {
        releaseWrite = () => callback();
      },
    });
    let completed = false;
    const pending = writeNodeStream(slowStream, "output").then(() => {
      completed = true;
    });
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
    expect(completed).toBe(false);
    releaseWrite?.();
    await pending;
    slowStream.end();

    const failingStream = new Writable({
      write(_chunk, _encoding, callback) {
        callback(new Error("sink failed"));
      },
    });
    await expect(writeNodeStream(failingStream, "output")).rejects.toThrow(
      "sink failed",
    );
  });

  it("prints help on stdout and exits successfully", async () => {
    const result = await runBuiltCli(["--help"]);

    expect(result.code).toBe(0);
    expect(result.stdout.toString("utf8")).toContain(
      "Usage: parse [--help] [--] <source-file>",
    );
    expect(result.stderr).toHaveLength(0);
  }, 15_000);

  it.each([
    { name: "missing path", args: [] },
    { name: "unknown option", args: ["--unknown"] },
    { name: "extra path", args: ["one.src", "two.src"] },
  ])(
    "rejects $name with usage status and stderr",
    async ({ args }) => {
      const result = await runBuiltCli(args);

      expect(result.code).toBe(2);
      expect(result.stdout).toHaveLength(0);
      expect(result.stderr.toString("utf8")).toContain("Usage: parse");
    },
    15_000,
  );

  it("parses a path with spaces and Unicode through the npm command cleanly", async () => {
    const sourcePath = join(temporaryDirectory, "來源 with spaces.src");
    await writeFile(sourcePath, "alpha + β");

    const result = await runNpm(["--silent", "run", "parse", "--", sourcePath]);

    expect(result.code).toBe(0);
    expect(result.stderr).toHaveLength(0);
    expect(result.stdout.toString("utf8")).toMatch(/^\{\n/);
    const parsed = parseJson(result.stdout);
    expect(parsed.status).toBe("complete");
    expect(parsed.root).toBeDefined();
  }, 15_000);

  it("accepts a source filename beginning with a hyphen after --", async () => {
    const hyphenDirectory = await mkdtemp(
      join(PROJECT_ROOT, "-tmp-cli-hyphen-"),
    );
    const relativePath = join(basename(hyphenDirectory), "-draft.src");
    try {
      await writeFile(join(PROJECT_ROOT, relativePath), "value");

      const result = await runBuiltCli(["--", relativePath]);

      expect(result.code).toBe(0);
      expect(result.stderr).toHaveLength(0);
      expect(parseJson(result.stdout).status).toBe("complete");
    } finally {
      await rm(hyphenDirectory, { recursive: true, force: true });
    }
  }, 15_000);

  it("serializes empty and recovered source files with correct parse statuses", async () => {
    const emptyPath = join(temporaryDirectory, "empty.src");
    const recoveredPath = join(temporaryDirectory, "recovered.src");
    await writeFile(emptyPath, Buffer.alloc(0));
    await writeFile(recoveredPath, "(alpha + ]");

    const empty = await runBuiltCli([emptyPath]);
    const recovered = await runBuiltCli([recoveredPath]);

    expect(empty.code).toBe(0);
    expect(parseJson(empty.stdout).status).toBe("complete");
    expect(recovered.code).toBe(1);
    expect(parseJson(recovered.stdout)).toMatchObject({
      status: "error",
      root: { expression: expect.anything() },
    });
    expect(recovered.stderr).toHaveLength(0);
  }, 15_000);

  it("preserves malformed UTF-8 diagnostic spans and recovered trees", async () => {
    const malformedPath = join(temporaryDirectory, "malformed-utf8.src");
    await writeFile(malformedPath, Buffer.from([0x61, 0x20, 0xff, 0x62]));

    const result = await runBuiltCli([malformedPath]);
    const parsed = parseJson(result.stdout);
    const diagnostics = parsed.diagnostics as Array<Record<string, unknown>>;

    expect(result.code).toBe(1);
    expect(parsed.status).toBe("error");
    expect(parsed.root).toBeDefined();
    expect(diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-utf8",
          location: { start: 2, end: 3 },
        }),
      ]),
    );
  }, 15_000);

  it("reports missing files and directories on stderr without JSON stdout", async () => {
    const missingPath = join(temporaryDirectory, "does-not-exist.src");
    const directoryPath = join(temporaryDirectory, "source-directory");
    await mkdir(directoryPath);

    for (const path of [missingPath, directoryPath]) {
      const result = await runBuiltCli([path]);
      expect(result.code).toBe(2);
      expect(result.stdout).toHaveLength(0);
      expect(result.stderr.toString("utf8").length).toBeGreaterThan(0);
    }
  }, 15_000);

  it("reports an unreadable source file as a read failure", async ({
    skip,
  }) => {
    if (process.platform === "win32" || process.getuid?.() === 0) {
      skip(
        "Permission-denied behavior cannot be reliably exercised as root or on Windows.",
      );
    }

    const unreadablePath = join(temporaryDirectory, "unreadable.src");
    await writeFile(unreadablePath, "source");
    await chmod(unreadablePath, 0);
    try {
      const result = await runBuiltCli([unreadablePath]);
      expect(result.code).toBe(2);
      expect(result.stdout).toHaveLength(0);
      expect(result.stderr.toString("utf8")).toContain("permission denied");
    } finally {
      await chmod(unreadablePath, 0o600);
    }
  }, 15_000);

  it("drains output larger than a pipe buffer without truncation", async () => {
    const largePath = join(temporaryDirectory, "large.src");
    await writeFile(
      largePath,
      Array.from({ length: 350 }, () => "operand").join(" "),
    );

    const result = await runBuiltCli([largePath]);

    expect(result.code).toBe(0);
    expect(result.stderr).toHaveLength(0);
    expect(result.stdout.length).toBeGreaterThan(65_536);
    expect(result.stdout.at(-1)).toBe(0x0a);
    expect(parseJson(result.stdout).status).toBe("complete");
  }, 15_000);
});
