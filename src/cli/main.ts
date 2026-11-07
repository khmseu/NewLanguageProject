/**
 * Process entry point for the built source-parsing CLI.
 * @module
 */
import { executeCli } from "./execute.js";
import { writeNodeStream } from "./stream-writer.js";

/**
 * Runs the CLI and reports unexpected failures without forcing process exit.
 *
 * The awaited stream writers keep stdout JSON/help output complete even when
 * Node applies backpressure. Expected usage and input failures already return
 * their designated status from `executeCli`; exceptions remain failures and
 * are made visible on stderr.
 *
 * @returns A promise that settles after CLI output and status are established.
 * @throws If stderr itself fails while reporting an unexpected CLI failure.
 */
async function main(): Promise<void> {
  try {
    process.exitCode = await executeCli(process.argv.slice(2), {
      stdout: (chunk) => writeNodeStream(process.stdout, chunk),
      stderr: (chunk) => writeNodeStream(process.stderr, chunk),
    });
  } catch (error) {
    process.exitCode = 1;
    const detail =
      error instanceof Error ? (error.stack ?? error.message) : String(error);
    await writeNodeStream(
      process.stderr,
      `Unexpected CLI failure: ${detail}\n`,
    );
  }
}

await main();
