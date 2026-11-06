/**
 * Unified numeric candidate recognition and validation (DEC-089–091).
 * No component is converted to a host numeric value except bounded radix fields.
 * @module
 */
import type { SourceProcessingResult } from "../source/source-processing.js";

/** Uninterpreted numeric components; no rounding or suffix typing is performed. */
export interface CoreNumber {
  /** Integer or floating-point syntax, including invalid candidates. */
  readonly kind: "integer" | "float";
  /** Selected bounded digit base, even when other components are invalid. */
  readonly base: number;
  /** Unmodified digits and separators preceding the point. */
  readonly integer: string;
  /** Unmodified digits and separators after the point, if present. */
  readonly fraction: string | undefined;
  /** Unmodified decimal exponent component including an optional sign. */
  readonly exponent: string | undefined;
  /** Unmodified suffix spelling without its separator. */
  readonly suffix: string | undefined;
  /** ASCII-lowercase suffix key; no semantic meaning is assigned. */
  readonly suffixKey: string | undefined;
  /** Whether every numeric component satisfies the lexical rules. */
  readonly valid: boolean;
}

/** Result of scanning one numeric candidate before touching-run merging. */
export interface NumericCandidate {
  /** Exclusive translated scalar-unit offset. */
  readonly end: number;
  /** Frozen component metadata. */
  readonly numeric: CoreNumber;
}

/** Test one ASCII alphanumeric or underscore candidate character.
 * @param character - Translated scalar or undefined at EOF.
 * @returns Whether it belongs to a permissive component.
 */
function component(character: string | undefined): boolean {
  return character !== undefined && /^[A-Za-z0-9_]$/.test(character);
}

/** Validate digit sequences and separators without converting their value.
 * @param text - Component text.
 * @param base - Digit base.
 * @param empty - Whether an empty component is permitted.
 * @returns Whether each digit and separator is legal.
 */
function digits(text: string, base: number, empty = false): boolean {
  if (text.length === 0) return empty;
  let previousDigit = false;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 95) {
      if (!previousDigit || i + 1 === text.length) return false;
      previousDigit = false;
    } else {
      const value =
        c >= 48 && c <= 57
          ? c - 48
          : c >= 65 && c <= 90
            ? c - 65 + 10
            : c >= 97 && c <= 122
              ? c - 97 + 10
              : 99;
      if (value >= base) return false;
      previousDigit = true;
    }
  }
  return previousDigit;
}

/** Determine a radix field without parsing an unbounded host number.
 * @param text - Decimal field, potentially with separators and leading zeroes.
 * @returns Numeric value up to 36, or undefined if outside that range.
 */
function boundedBase(text: string): number | undefined {
  let value = 0;
  for (const c of text) {
    if (c === "_") continue;
    value = value * 10 + c.charCodeAt(0) - 48;
    if (value > 36) return undefined;
  }
  return value >= 2 ? value : undefined;
}

/**
 * Recognize and validate one candidate, retaining all components as text.
 * @param source - Globally translated source.
 * @param start - Inclusive translated scalar-unit offset.
 * @returns Candidate or undefined when no number begins at the offset.
 */
export function scanNumericAt(
  source: SourceProcessingResult,
  start: number,
): NumericCandidate | undefined {
  const at = (index: number) => source.units[index]?.character;
  const decimalDigit = (c: string | undefined) =>
    c !== undefined && c >= "0" && c <= "9";
  if (
    !decimalDigit(at(start)) &&
    !(at(start) === "." && decimalDigit(at(start + 1)))
  )
    return undefined;
  let i = start;
  let base = 10;
  let prefix = "";
  let radix = false;
  let valid = true;
  let integer = "";
  let fraction: string | undefined;
  let exponent: string | undefined;
  let suffix: string | undefined;
  let floating = false;
  if (at(i) !== ".") {
    let fieldEnd = i;
    while (decimalDigit(at(fieldEnd)) || at(fieldEnd) === "_") fieldEnd++;
    const field = source.units
      .slice(i, fieldEnd)
      .map((u) => u.character)
      .join("");
    const candidateBase = boundedBase(field);
    if (at(fieldEnd) === "#" && candidateBase !== undefined) {
      radix = true;
      base = candidateBase;
      valid = digits(field, 10) && !(field.length > 1 && field[0] === "0");
      i = fieldEnd + 1;
    } else if (at(i) === "0" && /^[bBoOdDxX]$/.test(at(i + 1) ?? "")) {
      prefix = at(i + 1)!.toLowerCase();
      base = prefix === "b" ? 2 : prefix === "o" ? 8 : prefix === "x" ? 16 : 10;
      i += 2;
    }
  }
  let invalidLetter = false;
  /**
   * Consume a permissive ASCII component, preserving invalid alphabetic tails.
   * @param stopExponent - Stop before an eligible first exponent marker.
   * @returns Component text without converting its value.
   */
  const read = (stopExponent: boolean): string => {
    let result = "";
    while (component(at(i))) {
      const c = at(i)!;
      if (
        stopExponent &&
        !invalidLetter &&
        (base === 16 ? /^[pP]$/.test(c) : /^[eE]$/.test(c))
      )
        break;
      if (/^[A-Za-z]$/.test(c) && !(base === 16 && /^[a-fA-F]$/.test(c)))
        invalidLetter = true;
      result += c;
      i++;
    }
    return result;
  };
  const canFloat = !radix && (prefix === "" || prefix === "x");
  integer = read(canFloat);
  if (canFloat && at(i) === ".") {
    floating = true;
    i++;
    fraction = read(true);
  }
  const marker = base === 16 ? /^[pP]$/ : /^[eE]$/;
  if (canFloat && !invalidLetter && marker.test(at(i) ?? "")) {
    floating = true;
    i++;
    let sign = "";
    if (at(i) === "+" || at(i) === "-") sign = at(i++)!;
    exponent = sign + read(false);
  }
  if (at(i) === "#") {
    i++;
    suffix = read(false);
  }
  const numericValid = floating
    ? digits(integer, base, true) &&
      digits(fraction ?? "", base, true) &&
      (integer.length > 0 || (fraction?.length ?? 0) > 0) &&
      (base !== 16 || exponent !== undefined) &&
      (exponent === undefined || digits(exponent.replace(/^[+-]/, ""), 10))
    : digits(integer, base);
  valid =
    valid &&
    numericValid &&
    (suffix === undefined || /^[A-Za-z0-9]+$/.test(suffix));
  return Object.freeze({
    end: i,
    numeric: Object.freeze({
      kind: floating ? "float" : "integer",
      base,
      integer,
      fraction,
      exponent,
      suffix,
      suffixKey: suffix?.toLowerCase(),
      valid,
    }),
  });
}
