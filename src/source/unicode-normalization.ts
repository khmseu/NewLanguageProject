/**
 * Unicode 18 normalization from checksum-verified generated tables and algorithmic
 * Hangul rules, without host String.normalize or whole-source policy decisions.
 * @module
 */
import {
  COMBINING_CLASSES,
  COMPOSITIONS,
  DECOMPOSITIONS,
} from "./unicode-normalization-data.js";

/**
 * Supported composed normalization forms: canonical NFC and compatibility NFKC.
 */
export type UnicodeNormalizationForm = "NFC" | "NFKC";

/** Code-point mappings with compatibility flags; nested table arrays are shared. */
const decompositionByCodePoint = new Map(
  DECOMPOSITIONS.map(([codePoint, compatibility, mapping]) => [
    codePoint,
    { compatibility, mapping },
  ]),
);
/** Nonzero canonical combining classes; absent code points have class zero. */
const combiningClassByCodePoint = new Map(COMBINING_CLASSES);
/** Eligible canonical composition pairs indexed by decimal pair keys. */
const compositionByPair = new Map(
  COMPOSITIONS.map(([starter, next, composite]) => [
    pairKey(starter, next),
    composite,
  ]),
);

/** First precomposed Hangul syllable code point. */
const hangulSBase = 0xac00;
/** First leading Hangul Jamo code point. */
const hangulLBase = 0x1100;
/** First vowel Hangul Jamo code point. */
const hangulVBase = 0x1161;
/** Trailing Jamo base; offset zero denotes no trailing consonant. */
const hangulTBase = 0x11a7;
/** Number of leading Jamo in algorithmic Hangul composition. */
const hangulLCount = 19;
/** Number of vowel Jamo in algorithmic Hangul composition. */
const hangulVCount = 21;
/** Number of trailing slots including the no-consonant slot. */
const hangulTCount = 28;
/** Syllables per leading Jamo: vowel slots times trailing slots. */
const hangulNCount = hangulVCount * hangulTCount;
/** Total number of algorithmically decomposed/composed Hangul syllables. */
const hangulSCount = hangulLCount * hangulNCount;

/**
 * Recursively decompose, canonically reorder, and compose using Unicode 18 data.
 * Iteration consumes code points rather than UTF-16 indices; lone surrogate code
 * units pass through unchanged instead of being rejected or replaced.
 * @param input - Text to normalize; source bytes and provenance are not involved.
 * @param form - NFC for canonical mappings, NFKC to include compatibility mappings.
 * @returns Normalized text without mutating input or generated tables.
 * @throws {RangeError} If form is neither NFC nor NFKC.
 */
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

/**
 * Recursively append table or algorithmic Hangul decompositions to a caller buffer.
 * @param codePoint - Code point to expand; unmapped values pass through unchanged.
 * @param compatibility - Whether to follow compatibility as well as canonical mappings.
 * @param output - Mutable accumulator, appended to rather than cleared.
 * @returns Nothing; the accumulator receives decomposed code points.
 */
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

/**
 * Stably reorder combining marks by class without moving them across class-zero starters.
 * @param codePoints - Decomposed code points, reordered in place.
 * @returns Nothing; equal-class order is preserved in the mutated array.
 */
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

/**
 * Compose canonically ordered code points subject to combining-class blocking.
 * @param codePoints - Ordered decomposition, read without mutation.
 * @returns A new mutable array using eligible table and Hangul compositions.
 */
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

/**
 * Try algorithmic Hangul first, then an eligible canonical table pair.
 * @param first - Current starter code point.
 * @param second - Following code point.
 * @returns Composite code point, or undefined when no eligible pair exists.
 */
function composePair(first: number, second: number): number | undefined {
  const hangulComposition = composeHangul(first, second);
  if (hangulComposition !== undefined) return hangulComposition;
  return compositionByPair.get(pairKey(first, second));
}

/**
 * Compose leading-plus-vowel Jamo or a trailing-free syllable plus trailing Jamo.
 * @param first - Leading Jamo or precomposed syllable candidate.
 * @param second - Vowel or trailing Jamo candidate.
 * @returns Algorithmic Hangul composite, or undefined for other pairs.
 */
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

/**
 * Build an unambiguous key for integer code-point pairs.
 * @param first - Starter code point.
 * @param second - Following code point.
 * @returns Comma-separated decimal code-point values.
 */
function pairKey(first: number, second: number): string {
  return `${first},${second}`;
}
