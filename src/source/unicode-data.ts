import xidContinue from "@unicode/unicode-18.0.0/Binary_Property/XID_Continue/regex.mjs";
import xidStart from "@unicode/unicode-18.0.0/Binary_Property/XID_Start/regex.mjs";
import characterNames from "@unicode/unicode-18.0.0/Names/index.mjs";
import abbreviationAliases from "@unicode/unicode-18.0.0/Names/Abbreviation/index.mjs";
import alternateAliases from "@unicode/unicode-18.0.0/Names/Alternate/index.mjs";
import controlAliases from "@unicode/unicode-18.0.0/Names/Control/index.mjs";
import correctionAliases from "@unicode/unicode-18.0.0/Names/Correction/index.mjs";
import figmentAliases from "@unicode/unicode-18.0.0/Names/Figment/index.mjs";

export const UNICODE_DATA_VERSION = "18.0.0" as const;

const aliasMaps = [
  abbreviationAliases,
  alternateAliases,
  controlAliases,
  correctionAliases,
  figmentAliases,
];

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

export function assertUnicodeDataVersion(version: string): void {
  if (version !== UNICODE_DATA_VERSION) {
    throw new RangeError(
      `Unicode data version mismatch: expected ${UNICODE_DATA_VERSION}, received ${version}`,
    );
  }
}

export function isXidStart(codePoint: number): boolean {
  return isScalar(codePoint) && xidStart.test(String.fromCodePoint(codePoint));
}

export function isXidContinue(codePoint: number): boolean {
  return isScalar(codePoint) && xidContinue.test(String.fromCodePoint(codePoint));
}

export function getUnicodeName(codePoint: number): string | undefined {
  return characterNames.get(codePoint);
}

export function getUnicodeNameAliases(codePoint: number): readonly string[] {
  const aliases: string[] = [];
  for (const aliasMap of aliasMaps) {
    aliases.push(...(aliasMap[codePoint] ?? []));
  }
  return Object.freeze(aliases);
}

export function findUnicodeCharacter(name: string): number | undefined {
  return namesByAsciiFold.get(asciiFold(name));
}

function isScalar(codePoint: number): boolean {
  return (
    Number.isInteger(codePoint) &&
    codePoint >= 0 &&
    codePoint <= 0x10ffff &&
    (codePoint < 0xd800 || codePoint > 0xdfff)
  );
}

function asciiFold(value: string): string {
  return value.replace(/[A-Z]/g, (letter) =>
    String.fromCharCode(letter.charCodeAt(0) + 0x20),
  );
}
