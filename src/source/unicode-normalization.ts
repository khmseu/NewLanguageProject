import {
  COMBINING_CLASSES,
  COMPOSITIONS,
  DECOMPOSITIONS,
} from "./unicode-normalization-data.js";

/**
 * Unicode 18 normalization implemented from generated, checksum-verified UCD
 * decomposition, combining-class, and composition data.
 */
export type UnicodeNormalizationForm = "NFC" | "NFKC";

const decompositionByCodePoint = new Map(
  DECOMPOSITIONS.map(([codePoint, compatibility, mapping]) => [
    codePoint,
    { compatibility, mapping },
  ]),
);
const combiningClassByCodePoint = new Map(COMBINING_CLASSES);
const compositionByPair = new Map(
  COMPOSITIONS.map(([starter, next, composite]) => [
    pairKey(starter, next),
    composite,
  ]),
);

const hangulSBase = 0xac00;
const hangulLBase = 0x1100;
const hangulVBase = 0x1161;
const hangulTBase = 0x11a7;
const hangulLCount = 19;
const hangulVCount = 21;
const hangulTCount = 28;
const hangulNCount = hangulVCount * hangulTCount;
const hangulSCount = hangulLCount * hangulNCount;

export function normalizeUnicode18(
  input: string,
  form: UnicodeNormalizationForm,
): string {
  if (form !== "NFC" && form !== "NFKC") {
    throw new RangeError(`Unsupported Unicode normalization form: ${form}`);
  }

  const compatibility = form === "NFKC";
  const decomposed: number[] = [];
  for (const character of input) {
    decompose(character.codePointAt(0)!, compatibility, decomposed);
  }
  canonicalOrder(decomposed);
  return canonicalCompose(decomposed)
    .map((codePoint) => String.fromCodePoint(codePoint))
    .join("");
}

function decompose(
  codePoint: number,
  compatibility: boolean,
  output: number[],
): void {
  const hangulIndex = codePoint - hangulSBase;
  if (hangulIndex >= 0 && hangulIndex < hangulSCount) {
    const leading = hangulLBase + Math.floor(hangulIndex / hangulNCount);
    const vowel =
      hangulVBase +
      Math.floor((hangulIndex % hangulNCount) / hangulTCount);
    const trailingIndex = hangulIndex % hangulTCount;
    output.push(leading, vowel);
    if (trailingIndex !== 0) output.push(hangulTBase + trailingIndex);
    return;
  }

  const mapping = decompositionByCodePoint.get(codePoint);
  if (!mapping || (mapping.compatibility && !compatibility)) {
    output.push(codePoint);
    return;
  }
  for (const component of mapping.mapping) {
    decompose(component, compatibility, output);
  }
}

function canonicalOrder(codePoints: number[]): void {
  for (let index = 1; index < codePoints.length; index += 1) {
    const currentClass = combiningClassByCodePoint.get(codePoints[index]!) ?? 0;
    if (currentClass === 0) continue;

    let position = index;
    while (position > 0) {
      const previousClass =
        combiningClassByCodePoint.get(codePoints[position - 1]!) ?? 0;
      if (previousClass === 0 || previousClass <= currentClass) break;
      [codePoints[position - 1], codePoints[position]] = [
        codePoints[position]!,
        codePoints[position - 1]!,
      ];
      position -= 1;
    }
  }
}

function canonicalCompose(codePoints: readonly number[]): number[] {
  if (codePoints.length < 2) return [...codePoints];

  const output = [codePoints[0]!];
  let starterPosition = 0;
  let starter = codePoints[0]!;
  let previousClass = 0;

  for (let index = 1; index < codePoints.length; index += 1) {
    const codePoint = codePoints[index]!;
    const currentClass = combiningClassByCodePoint.get(codePoint) ?? 0;
    const composite = composePair(starter, codePoint);

    if (
      composite !== undefined &&
      (previousClass === 0 || previousClass < currentClass)
    ) {
      output[starterPosition] = composite;
      starter = composite;
      continue;
    }

    if (currentClass === 0) {
      starterPosition = output.length;
      starter = codePoint;
    }
    output.push(codePoint);
    previousClass = currentClass;
  }
  return output;
}

function composePair(first: number, second: number): number | undefined {
  const hangulComposition = composeHangul(first, second);
  if (hangulComposition !== undefined) return hangulComposition;
  return compositionByPair.get(pairKey(first, second));
}

function composeHangul(first: number, second: number): number | undefined {
  const leadingIndex = first - hangulLBase;
  const vowelIndex = second - hangulVBase;
  if (
    leadingIndex >= 0 &&
    leadingIndex < hangulLCount &&
    vowelIndex >= 0 &&
    vowelIndex < hangulVCount
  ) {
    return (
      hangulSBase +
      (leadingIndex * hangulVCount + vowelIndex) * hangulTCount
    );
  }

  const syllableIndex = first - hangulSBase;
  const trailingIndex = second - hangulTBase;
  if (
    syllableIndex >= 0 &&
    syllableIndex < hangulSCount &&
    syllableIndex % hangulTCount === 0 &&
    trailingIndex > 0 &&
    trailingIndex < hangulTCount
  ) {
    return first + trailingIndex;
  }
  return undefined;
}

function pairKey(first: number, second: number): string {
  return `${first},${second}`;
}
