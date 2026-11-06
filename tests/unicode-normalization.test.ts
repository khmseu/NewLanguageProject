import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { normalizeUnicode18 } from "../src/index.js";
import { normalizeUnicode18WithOrigins } from "../src/source/unicode-normalization.js";

const normalizationFixture = readFileSync(
  new URL("./fixtures/NormalizationTest-18.0.0.txt", import.meta.url),
  "utf8",
);

function decodeCodePoints(value: string): string {
  const points = value
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .map((point) => Number.parseInt(point, 16));
  return String.fromCodePoint(...points);
}

describe("Unicode 18 NormalizationTest.txt", () => {
  it("retains exact contributors through decomposition, reordering and composition", () => {
    expect(normalizeUnicode18WithOrigins("\u0344", "NFC")).toEqual([
      { character: "\u0308", inputOffsets: [0] },
      { character: "\u0301", inputOffsets: [0] },
    ]);

    expect(normalizeUnicode18WithOrigins("x\u0315\u0300", "NFC")).toEqual([
      { character: "x", inputOffsets: [0] },
      { character: "\u0300", inputOffsets: [2] },
      { character: "\u0315", inputOffsets: [1] },
    ]);
    expect(normalizeUnicode18WithOrigins("a\u0315\u0300", "NFC")).toEqual([
      { character: "à", inputOffsets: [0, 2] },
      { character: "\u0315", inputOffsets: [1] },
    ]);
    expect(normalizeUnicode18WithOrigins("A\u030a", "NFC")).toEqual([
      { character: "Å", inputOffsets: [0, 1] },
    ]);
    expect(normalizeUnicode18WithOrigins("각", "NFC")).toEqual([
      { character: "각", inputOffsets: [0] },
    ]);
  });

  it("passes every official NFC and NFKC column assertion", () => {
    expect(
      normalizationFixture.startsWith("# NormalizationTest-18.0.0.txt"),
    ).toBe(true);

    let rows = 0;
    for (const rawLine of normalizationFixture.split(/\r?\n/u)) {
      const data = rawLine.split("#", 1)[0]!.trim();
      if (!data || data.startsWith("@")) continue;

      const [c1, c2, c3, c4, c5] = data
        .split(";")
        .slice(0, 5)
        .map(decodeCodePoints);
      if (
        c1 === undefined ||
        c2 === undefined ||
        c3 === undefined ||
        c4 === undefined ||
        c5 === undefined
      ) {
        throw new Error(
          `Malformed Unicode normalization fixture row: ${rawLine}`,
        );
      }

      expect(
        [c1, c2, c3, c4, c5].map((value) => normalizeUnicode18(value, "NFC")),
      ).toEqual([c2, c2, c2, c4, c4]);
      expect(
        [c1, c2, c3, c4, c5].map((value) => normalizeUnicode18(value, "NFKC")),
      ).toEqual([c4, c4, c4, c4, c4]);
      rows += 1;
    }

    expect(rows).toBe(20_171);
  }, 30_000);
});
