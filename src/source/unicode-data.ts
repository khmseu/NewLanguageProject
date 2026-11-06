/**
 * Unicode 18 identifier properties and character-name services from pinned data,
 * independent of the host runtime's Unicode version.
 * @module
 */
import xidContinue from "@unicode/unicode-18.0.0/Binary_Property/XID_Continue/regex.mjs";
import xidStart from "@unicode/unicode-18.0.0/Binary_Property/XID_Start/regex.mjs";
import characterNames from "@unicode/unicode-18.0.0/Names/index.mjs";
import abbreviationAliases from "@unicode/unicode-18.0.0/Names/Abbreviation/index.mjs";
import alternateAliases from "@unicode/unicode-18.0.0/Names/Alternate/index.mjs";
import controlAliases from "@unicode/unicode-18.0.0/Names/Control/index.mjs";
import correctionAliases from "@unicode/unicode-18.0.0/Names/Correction/index.mjs";
import figmentAliases from "@unicode/unicode-18.0.0/Names/Figment/index.mjs";

/** Unicode version expected by this module; the assertion compares this string only. */
export const UNICODE_DATA_VERSION = "18.0.0" as const;

/** Alias categories in precedence order after normative character names. */
const aliasMaps = [
  abbreviationAliases,
  alternateAliases,
  controlAliases,
  correctionAliases,
  figmentAliases,
];

/**
 * Module-initialized reverse name index with ASCII-only case folding. Normative
 * names win over aliases; earlier alias categories win over later collisions.
 */
const namesByAsciiFold = new Map<string, number>();
for (const [codePoint, name] of characterNames) {
  namesByAsciiFold.set(asciiFold(name), codePoint);
}
for (const aliases of aliasMaps) {
  for (const [codePoint, names] of Object.entries(aliases)) {
    for (const name of names) {
      const foldedName = asciiFold(name);
      if (!namesByAsciiFold.has(foldedName)) {
        namesByAsciiFold.set(foldedName, Number(codePoint));
      }
    }
  }
}

/**
 * Compare a caller's expected version to the pinned version, not host ICU data.
 * @param version - Exact expected version string.
 * @returns Nothing when the versions agree.
 * @throws {RangeError} If version differs from 18.0.0.
 */
export function assertUnicodeDataVersion(version: string): void {
  if (version !== UNICODE_DATA_VERSION) {
    throw new RangeError(
      `Unicode data version mismatch: expected ${UNICODE_DATA_VERSION}, received ${version}`,
    );
  }
}

/**
 * Test the Unicode 18 XID_Start property.
 * @param codePoint - Numeric scalar candidate.
 * @returns False for non-scalars, otherwise the pinned property membership.
 */
export function isXidStart(codePoint: number): boolean {
  return isScalar(codePoint) && xidStart.test(String.fromCodePoint(codePoint));
}

/**
 * Test the Unicode 18 XID_Continue property.
 * @param codePoint - Numeric scalar candidate.
 * @returns False for non-scalars, otherwise the pinned property membership.
 */
export function isXidContinue(codePoint: number): boolean {
  return (
    isScalar(codePoint) && xidContinue.test(String.fromCodePoint(codePoint))
  );
}

/**
 * Look up a normative character name without scalar validation or alias fallback.
 * @param codePoint - Numeric key in the pinned name map.
 * @returns The stored name, or undefined when no name is present.
 */
export function getUnicodeName(codePoint: number): string | undefined {
  return characterNames.get(codePoint);
}

/**
 * Collect aliases across all categories without deduplication.
 * @param codePoint - Numeric key; missing keys simply produce no aliases.
 * @returns A fresh frozen array in alias-category order, empty when absent.
 */
export function getUnicodeNameAliases(codePoint: number): readonly string[] {
  const aliases: string[] = [];
  for (const aliasMap of aliasMaps) {
    aliases.push(...(aliasMap[codePoint] ?? []));
  }
  return Object.freeze(aliases);
}

/**
 * Reverse-lookup a normative name or alias using ASCII case insensitivity only.
 * Spaces, punctuation and non-ASCII letters are neither normalized nor removed.
 * @param name - Complete name or alias.
 * @returns Matching code point, or undefined; normative names take precedence.
 */
export function findUnicodeCharacter(name: string): number | undefined {
  return namesByAsciiFold.get(asciiFold(name));
}

/**
 * Reject nonintegers, out-of-range values and surrogate code points.
 * @param codePoint - Numeric candidate.
 * @returns Whether the candidate is a Unicode scalar.
 */
function isScalar(codePoint: number): boolean {
  return (
    Number.isInteger(codePoint) &&
    codePoint >= 0 &&
    codePoint <= 0x10ffff &&
    (codePoint < 0xd800 || codePoint > 0xdfff)
  );
}

/**
 * Lowercase ASCII A–Z without host Unicode case mapping or normalization.
 * @param value - Name or alias.
 * @returns Text with only ASCII uppercase letters replaced.
 */
function asciiFold(value: string): string {
  return value.replace(/[A-Z]/g, (letter) =>
    String.fromCharCode(letter.charCodeAt(0) + 0x20),
  );
}
