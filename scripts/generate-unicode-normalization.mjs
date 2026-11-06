/**
 * Generate Unicode 18 normalization tables from checksum-pinned local UCD files.
 * Download UnicodeData.txt and DerivedNormalizationProps.txt from
 * https://www.unicode.org/Public/18.0.0/ucd/ into a local directory, then run
 * `node scripts/generate-unicode-normalization.mjs <ucd-directory> [output-path]`
 * from the repository root. Defaults are tools/unicode-18.0.0/ucd and
 * src/source/unicode-normalization-data.ts, relative to the working directory.
 *
 * Both files are read concurrently and verified before parsing. The procedure
 * collects decompositions and nonzero combining classes, expands full-composition
 * exclusions, then derives eligible canonical pairs and emits documented tables
 * with the Unicode notice. No network access or directory creation is performed.
 * Top-level await rejects on file I/O, checksum or parsing/serialization failure;
 * successful writes overwrite the destination and print row counts.
 * @module
 */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

/** Expected SHA-256 digests of the exact official Unicode 18 input bytes. */
const expectedHashes = new Map([
  [
    "UnicodeData.txt",
    "0736451de439ae7baf1425136617da495e09ee5afbe6e394374db7009ea08950",
  ],
  [
    "DerivedNormalizationProps.txt",
    "98ac7f67d985fe781e317f6182e885e94cabb0c314769e6dd73e48b226931ccd",
  ],
]);
/** Absolute local input directory, resolved from the optional first CLI argument. */
const inputDirectory = resolve(process.argv[2] ?? "tools/unicode-18.0.0/ucd");

/**
 * Read a local input and verify its raw bytes before decoding as UTF-8.
 * @param {string} filename - Basename expected in the checksum map.
 * @returns {Promise<string>} Verified file text; rejects rather than returning unverified content.
 * @throws {Error} If reading fails or the SHA-256 digest differs (including an unknown filename).
 */
async function readVerified(filename) {
  const content = await readFile(join(inputDirectory, filename));
  const digest = createHash("sha256").update(content).digest("hex");
  if (digest !== expectedHashes.get(filename)) {
    throw new Error(
      `${filename} SHA-256 mismatch: expected ${expectedHashes.get(filename)}, got ${digest}`,
    );
  }
  return content.toString("utf8");
}

/** Verified UCD texts used for decomposition/class rows and composition exclusions. */
const [unicodeData, derivedNormalizationProps] = await Promise.all([
  readVerified("UnicodeData.txt"),
  readVerified("DerivedNormalizationProps.txt"),
]);

/** Mutable rows [code point, compatibility flag, direct mapping] in input order. */
const decompositions = [];
/** Mutable rows [code point, nonzero canonical combining class] in input order. */
const combiningClasses = [];
for (const line of unicodeData.split(/\r?\n/u)) {
  if (line.length === 0) continue;
  const fields = line.split(";");
  const codePoint = Number.parseInt(fields[0], 16);
  const combiningClass = Number.parseInt(fields[3], 10);
  const decomposition = fields[5];
  if (combiningClass !== 0) combiningClasses.push([codePoint, combiningClass]);
  if (decomposition !== "") {
    const values = decomposition.trim().split(/\s+/u);
    const compatibility = values[0].startsWith("<");
    decompositions.push([
      codePoint,
      compatibility,
      values
        .slice(compatibility ? 1 : 0)
        .map((value) => Number.parseInt(value, 16)),
    ]);
  }
}

/** Expanded Full_Composition_Exclusion code points, including inclusive UCD ranges. */
const compositionExclusions = new Set();
for (const rawLine of derivedNormalizationProps.split(/\r?\n/u)) {
  const line = rawLine.split("#", 1)[0].trim();
  if (!line) continue;
  const [range, property] = line.split(";").map((part) => part.trim());
  if (property !== "Full_Composition_Exclusion") continue;
  const [first, last = first] = range.split("..");
  const start = Number.parseInt(first, 16);
  const end = Number.parseInt(last, 16);
  for (let codePoint = start; codePoint <= end; codePoint += 1) {
    compositionExclusions.add(codePoint);
  }
}

/** Canonical two-code-point mappings reversed to [starter, next, composite], excluding full exclusions. */
const compositions = [];
for (const [codePoint, compatibility, mapping] of decompositions) {
  if (
    !compatibility &&
    mapping.length === 2 &&
    !compositionExclusions.has(codePoint)
  ) {
    compositions.push([mapping[0], mapping[1], codePoint]);
  }
}

/**
 * Render table entries with indentation and trailing commas, but no outer brackets.
 * @typeParam T - Row payload accepted by the supplied renderer.
 * @param {T[]} rows - Rows in the desired output order, read without mutation.
 * @param {(row: T) => string} renderRow - Serializer for a single tuple.
 * @returns {string} Newline-joined row source, or empty text for no rows.
 * @throws {Error} Propagates any exception raised by the renderer.
 */
function tupleRows(rows, renderRow) {
  return rows.map((row) => `  ${renderRow(row)},`).join("\n");
}

/** Complete generated TypeScript, including declaration contracts and license notice. */
const output = `/**
 * Generated from Unicode 18.0.0 UnicodeData.txt and
 * DerivedNormalizationProps.txt. See scripts/generate-unicode-normalization.mjs
 * for the verified source URLs, SHA-256 checksums, and generation procedure.
 * © 2026 Unicode®, Inc. Unicode and the Unicode Logo are registered trademarks
 * of Unicode, Inc. in the U.S. and other countries.
 * For terms of use and license, see https://www.unicode.org/terms_of_use.html.
 * @module
 */
/**
 * Direct decomposition rows [code point, compatibility-only flag, mapping code
 * points], in UCD order. Canonical mappings have a false flag; consumers recursively
 * expand mappings and handle Hangul algorithmically. Numeric entries are code
 * points, not bytes or UTF-16 offsets. Readonly is compile-time only: these arrays
 * are not frozen and consumers must not mutate this shared generated data.
 */
export const DECOMPOSITIONS: readonly (readonly [number, boolean, readonly number[]])[] = [
${tupleRows(decompositions, ([cp, compatibility, mapping]) => `[0x${cp.toString(16)}, ${compatibility}, [${mapping.map((value) => `0x${value.toString(16)}`).join(", ")}]]`)}
];

/**
 * Rows [code point, canonical combining class] for nonzero classes, in UCD order.
 * Missing code points have class zero. Readonly is compile-time only; no runtime
 * freezing or defensive copying is performed.
 */
export const COMBINING_CLASSES: readonly (readonly [number, number])[] = [
${tupleRows(combiningClasses, ([cp, value]) => `[0x${cp.toString(16)}, ${value}]`)}
];

/**
 * Eligible canonical composition rows [starter, next, composite] in decomposition
 * order, omitting compatibility mappings and Full_Composition_Exclusion members.
 * Hangul pairs are handled algorithmically, not listed here. Entries are code
 * points; readonly is compile-time only and the shared arrays are not frozen.
 */
export const COMPOSITIONS: readonly (readonly [number, number, number])[] = [
${tupleRows(compositions, ([starter, next, composite]) => `[0x${starter.toString(16)}, 0x${next.toString(16)}, 0x${composite.toString(16)}]`)}
];
`;

/** Absolute destination from the optional second CLI argument; existing files are overwritten. */
const outputPath = resolve(
  process.argv[3] ?? "src/source/unicode-normalization-data.ts",
);
await writeFile(outputPath, output);
console.log(
  `Generated ${outputPath}: ${decompositions.length} decompositions, ${combiningClasses.length} combining classes, ${compositions.length} compositions.`,
);
