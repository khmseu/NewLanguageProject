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

/** One normalized code point and the input code points that contributed to it. */
export interface NormalizedScalar {
  /** One code-point string; lone surrogate code units pass through as in the text API. */
  readonly character: string;
  /** Sorted unique code-point indices in the input; compiler input contains only scalars. */
  readonly inputOffsets: readonly number[];
}

/** Mutable algorithm record; decomposition copies and composition unions origins. */
interface NormalizationUnit {
  /** Current decomposed or composed code point. */
  codePoint: number;
  /** Contributing input scalar offsets, carried through canonical reordering. */
  inputOffsets: number[];
}

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
  return normalizeUnicode18WithOrigins(input, form)
    .map((unit) => unit.character).join("");
}

/**
 * Normalize with exact scalar contributors, not UTF-16 offsets or byte hulls.
 * Decomposition duplicates origins, reordering moves them, and composition unions
 * them. Callers choose original-byte diagnostic ranges using those contributors.
 * @param input - Text whose scalar indices identify original contributors.
 * @param form - NFC or NFKC, using the same tables and algorithm as the text API.
 * @returns Frozen records and origin arrays, with no fabricated input positions.
 * @throws {RangeError} If form is neither NFC nor NFKC.
 */
export function normalizeUnicode18WithOrigins(
  input: string,
  form: UnicodeNormalizationForm,
): readonly NormalizedScalar[] {
  if (form !== "NFC" && form !== "NFKC") {
    throw new RangeError(`Unsupported Unicode normalization form: ${form}`);
  }

  const compatibility = form === "NFKC";
  const decomposed: NormalizationUnit[] = [];
  let inputOffset = 0;
  for (const character of input) {
    const expanded: number[] = [];
    decompose(character.codePointAt(0)!, compatibility, expanded);
    for (const codePoint of expanded) {
      decomposed.push({ codePoint, inputOffsets: [inputOffset] });
    }
    inputOffset += 1;
  }
  canonicalOrder(decomposed);
  return Object.freeze(canonicalCompose(decomposed).map((unit) => Object.freeze({
    character: String.fromCodePoint(unit.codePoint),
    inputOffsets: Object.freeze(unit.inputOffsets),
  })));
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
 * @param codePoints - Decomposed records, reordered together with their origins.
 * @returns Nothing; equal-class order and each record's contributors are preserved.
 */
function canonicalOrder(codePoints: NormalizationUnit[]): void {
  for (let index = 1; index < codePoints.length; index += 1) {
    const currentClass = combiningClassByCodePoint.get(codePoints[index]!.codePoint) ?? 0;
    if (currentClass === 0) continue;

    let position = index;
    while (position > 0) {
      const previousClass =
        combiningClassByCodePoint.get(codePoints[position - 1]!.codePoint) ?? 0;
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
 * Compose canonically ordered code points subject to combining-class blocking,
 * unioning the exact contributing input indices at each composition.
 * @param codePoints - Ordered decomposition records, read without mutation.
 * @returns A new mutable array using eligible table and Hangul compositions.
 */
function canonicalCompose(codePoints: readonly NormalizationUnit[]): NormalizationUnit[] {
  if (codePoints.length < 2) return [...codePoints];

  const output = [{ ...codePoints[0]!, inputOffsets: [...codePoints[0]!.inputOffsets] }];
  let starterPosition = 0;
  let starter = codePoints[0]!.codePoint;
  let previousClass = 0;

  for (let index = 1; index < codePoints.length; index += 1) {
    const unit = codePoints[index]!;
    const codePoint = unit.codePoint;
    const currentClass = combiningClassByCodePoint.get(codePoint) ?? 0;
    const composite = composePair(starter, codePoint);

    if (
      composite !== undefined &&
      (previousClass === 0 || previousClass < currentClass)
    ) {
      output[starterPosition] = {
        codePoint: composite,
        inputOffsets: [...new Set([...output[starterPosition]!.inputOffsets, ...unit.inputOffsets])]
          .sort((left, right) => left - right),
      };
      starter = composite;
      continue;
    }

    if (currentClass === 0) {
      starterPosition = output.length;
      starter = codePoint;
    }
    output.push({ codePoint, inputOffsets: [...unit.inputOffsets] });
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
