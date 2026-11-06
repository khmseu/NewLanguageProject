import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

// Download the inputs from https://www.unicode.org/Public/18.0.0/ucd/UnicodeData.txt
// and https://www.unicode.org/Public/18.0.0/ucd/DerivedNormalizationProps.txt.
// Run: node scripts/generate-unicode-normalization.mjs <ucd-directory>
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
const inputDirectory = resolve(
  process.argv[2] ?? "tools/unicode-18.0.0/ucd",
);

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

const [unicodeData, derivedNormalizationProps] = await Promise.all([
  readVerified("UnicodeData.txt"),
  readVerified("DerivedNormalizationProps.txt"),
]);

const decompositions = [];
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

const compositions = [];
for (const [codePoint, compatibility, mapping] of decompositions) {
  if (!compatibility && mapping.length === 2 && !compositionExclusions.has(codePoint)) {
    compositions.push([mapping[0], mapping[1], codePoint]);
  }
}

function tupleRows(rows, renderRow) {
  return rows.map((row) => `  ${renderRow(row)},`).join("\n");
}

const output = `/**
 * Generated from Unicode 18.0.0 UnicodeData.txt and
 * DerivedNormalizationProps.txt. See scripts/generate-unicode-normalization.mjs
 * for the verified source URLs, SHA-256 checksums, and generation procedure.
 * © 2026 Unicode®, Inc. Unicode and the Unicode Logo are registered trademarks
 * of Unicode, Inc. in the U.S. and other countries.
 * For terms of use and license, see https://www.unicode.org/terms_of_use.html.
 */
export const DECOMPOSITIONS: readonly (readonly [number, boolean, readonly number[]])[] = [
${tupleRows(decompositions, ([cp, compatibility, mapping]) => `[0x${cp.toString(16)}, ${compatibility}, [${mapping.map((value) => `0x${value.toString(16)}`).join(", ")}]]`)}
];

export const COMBINING_CLASSES: readonly (readonly [number, number])[] = [
${tupleRows(combiningClasses, ([cp, value]) => `[0x${cp.toString(16)}, ${value}]`)}
];

export const COMPOSITIONS: readonly (readonly [number, number, number])[] = [
${tupleRows(compositions, ([starter, next, composite]) => `[0x${starter.toString(16)}, 0x${next.toString(16)}, 0x${composite.toString(16)}]`)}
];
`;

const outputPath = resolve(
  process.argv[3] ?? "src/source/unicode-normalization-data.ts",
);
await writeFile(outputPath, output);
console.log(
  `Generated ${outputPath}: ${decompositions.length} decompositions, ${combiningClasses.length} combining classes, ${compositions.length} compositions.`,
);
