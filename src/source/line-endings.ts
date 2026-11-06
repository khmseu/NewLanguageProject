/**
 * Shared DEC-032 hard-ending classification after decoding or global translation.
 * @module
 */

/**
 * Identify the complete selected hard-break set, including CR and LF.
 * @param codePoint - Scalar value; undefined denotes EOF and is not a break.
 * @returns Whether the scalar is LF, CR, VT, FF, NEL, LS or PS.
 */
export function isHardLineBreak(codePoint: number | undefined): boolean {
  return codePoint === 0x0a || codePoint === 0x0d ||
    codePoint === 0x0b || codePoint === 0x0c || codePoint === 0x85 ||
    codePoint === 0x2028 || codePoint === 0x2029;
}

/**
 * Measure one logical hard ending, grouping adjacent CR/LF regardless of origin.
 * @param first - Current scalar, or undefined at EOF.
 * @param second - Following scalar, or undefined at EOF.
 * @returns Zero for nonbreaks, two for CRLF, otherwise one scalar unit.
 */
export function hardLineBreakWidth(
  first: number | undefined,
  second: number | undefined,
): number {
  return first === 0x0d && second === 0x0a ? 2 : isHardLineBreak(first) ? 1 : 0;
}
