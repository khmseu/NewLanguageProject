/**
 * Raw-byte file loading for the internal compiler CLI support.
 */
import { readFile } from "node:fs/promises";

/**
 * Result of loading one source file without decoding its bytes.
 */
export type SourceFileResult =
  | {
      /** The path was read successfully. */
      readonly kind: "loaded";
      /** Path spelling selected by the argument parser. */
      readonly path: string;
      /** A fresh byte array containing the file exactly as stored. */
      readonly bytes: Uint8Array;
    }
  | {
      /** A Node filesystem operation failed while reading the path. */
      readonly kind: "read-error";
      /** Path whose read operation failed. */
      readonly path: string;
      /** Contextual explanation intended for stderr. */
      readonly message: string;
      /** Read-failure process status; this function does not exit. */
      readonly exitCode: 2;
    };

/**
 * Filesystem operations used to read complete file contents.
 *
 * @remarks Invalid arguments and other programming errors are not represented
 * as filesystem failures and propagate to the caller.
 */
const FILE_READ_SYSCALLS: ReadonlySet<string> = new Set([
  "open",
  "read",
  "close",
]);

/**
 * Reads a source file as original bytes using Node's filesystem API.
 *
 * No UTF-8 decoding or text normalization occurs here. Only Node filesystem
 * errors associated with opening, reading, or closing a file are converted to
 * a result; unexpected exceptions remain visible to the caller.
 *
 * @param path Path selected by the CLI argument parser.
 * @returns The original bytes, or a contextual read-error result with status 2.
 * @throws Any unexpected/programming error raised by the filesystem API.
 */
export async function readSourceFile(path: string): Promise<SourceFileResult> {
  try {
    const bytes = await readFile(path);
    return { kind: "loaded", path, bytes: new Uint8Array(bytes) };
  } catch (error) {
    if (!isFileReadError(error)) {
      throw error;
    }

    return {
      kind: "read-error",
      path,
      message: formatReadError(path, error),
      exitCode: 2,
    };
  }
}

/**
 * Determines whether an exception came from a Node file read operation.
 *
 * @param error Thrown value returned by the filesystem API.
 * @returns True only for an errno-style error with a recognized file-read syscall.
 * @throws This type guard does not throw.
 */
function isFileReadError(error: unknown): error is NodeJS.ErrnoException {
  if (!(error instanceof Error)) {
    return false;
  }
  const systemError = error as NodeJS.ErrnoException;
  return (
    typeof systemError.code === "string" &&
    typeof systemError.syscall === "string" &&
    FILE_READ_SYSCALLS.has(systemError.syscall)
  );
}

/**
 * Creates a concise, contextual description for an expected file-read error.
 *
 * @param path Path that could not be read.
 * @param error Node errno exception from a file-read syscall.
 * @returns A human-readable path-specific message.
 * @throws This formatter does not throw for a valid path and errno exception.
 */
function formatReadError(path: string, error: NodeJS.ErrnoException): string {
  const detail =
    error.code === "ENOENT"
      ? "file or directory does not exist"
      : error.code === "EISDIR"
        ? "path is a directory"
        : error.code === "EACCES" || error.code === "EPERM"
          ? "permission denied"
          : error.message;
  return `Unable to read source file '${path}': ${detail}`;
}
