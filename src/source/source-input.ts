/**
 * Owned source bytes and validated half-open byte ranges, independent of decoded
 * text or JavaScript UTF-16 indices.
 * @module
 */
/** A half-open interval in original bytes; standalone objects are not validated. */
export interface ByteRange {
  /** Inclusive zero-based byte offset. */
  readonly start: number;
  /** Exclusive zero-based byte offset; equal to start for an empty range. */
  readonly end: number;
}

/** Owns a defensive copy of input bytes; all byte reads return independent copies. */
export class SourceInput {
  /** Private owned storage, never exposed directly. */
  readonly #bytes: Uint8Array;

  /**
   * Capture bytes without decoding or validating UTF-8.
   * @param bytes - Original source bytes, copied on construction.
   * @throws {TypeError} If bytes is not a Uint8Array.
   */
  constructor(bytes: Uint8Array) {
    if (!(bytes instanceof Uint8Array)) {
      throw new TypeError("Source input must be a Uint8Array");
    }

    this.#bytes = new Uint8Array(bytes);
  }

  /** @returns The number of original bytes, not scalars or UTF-16 code units. */
  get byteLength(): number {
    return this.#bytes.byteLength;
  }

  /** @returns A mutable defensive copy of all original bytes. */
  get bytes(): Uint8Array {
    return this.#bytes.slice();
  }

  /**
   * Create a frozen, validated byte interval.
   * @param start - Inclusive byte offset.
   * @param end - Exclusive byte offset.
   * @returns A fresh frozen range, including empty ranges at EOF.
   * @throws {RangeError} If bounds are nonintegral, reversed or outside the input.
   */
  range(start: number, end: number): ByteRange {
    return validateByteRange({ start, end }, this.byteLength);
  }

  /**
   * Copy a validated interval without altering the stored bytes.
   * @param range - Half-open original-byte bounds.
   * @returns A mutable independent byte array.
   * @throws {RangeError} If the range shape or bounds are invalid.
   */
  slice(range: ByteRange): Uint8Array {
    const checkedRange = validateByteRange(range, this.byteLength);
    return this.#bytes.slice(checkedRange.start, checkedRange.end);
  }
}

/**
 * Validate and snapshot caller-supplied byte bounds.
 * @param range - Untrusted half-open range.
 * @param byteLength - Upper bound in bytes.
 * @returns A fresh frozen range rather than the caller's object.
 * @throws {RangeError} If integer bounds do not satisfy 0 <= start <= end <= byteLength.
 */
function validateByteRange(range: ByteRange, byteLength: number): ByteRange {
  if (
    typeof range !== "object" ||
    range === null ||
    typeof range.start !== "number" ||
    typeof range.end !== "number"
  ) {
    throw new RangeError("Invalid byte range: expected numeric start and end");
  }

  if (
    !Number.isInteger(range.start) ||
    !Number.isInteger(range.end) ||
    range.start < 0 ||
    range.end < range.start ||
    range.end > byteLength
  ) {
    throw new RangeError(
      `Invalid byte range [${range.start}, ${range.end}) for source of ${byteLength} bytes`,
    );
  }

  return Object.freeze({ start: range.start, end: range.end });
}
