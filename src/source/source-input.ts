export interface ByteRange {
  readonly start: number;
  readonly end: number;
}

export class SourceInput {
  readonly #bytes: Uint8Array;

  constructor(bytes: Uint8Array) {
    if (!(bytes instanceof Uint8Array)) {
      throw new TypeError("Source input must be a Uint8Array");
    }

    this.#bytes = new Uint8Array(bytes);
  }

  get byteLength(): number {
    return this.#bytes.byteLength;
  }

  get bytes(): Uint8Array {
    return this.#bytes.slice();
  }

  range(start: number, end: number): ByteRange {
    return validateByteRange({ start, end }, this.byteLength);
  }

  slice(range: ByteRange): Uint8Array {
    const checkedRange = validateByteRange(range, this.byteLength);
    return this.#bytes.slice(checkedRange.start, checkedRange.end);
  }
}

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
