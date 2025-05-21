import { describe, expect, it } from "@jest/globals";

import { parseXmlOptions } from "./parseXmlOptions.ts";

describe("parseXmlOptions()", () => {
  it("returns 0 if no options are set", () => {
    expect(parseXmlOptions({})).toBe(0);
  });
  it("returns the correct bitwise OR of two options", () => {
    const options = { recover: true, noEnt: true };
    expect(parseXmlOptions(options)).toBe(0x01 | 0x02);
  });

  it("returns the correct bitwise OR of options", () => {
    const options = {
      recover: true,
      noEnt: true,
      dtdLoad: true,
      dtdAttr: true,
      dtdValid: true,
      noError: true,
      noWarning: true,
      pedantic: true,
      noBlanks: true,
      sax1: true,
      xInclude: true,
      noNet: true,
      noDict: true,
      nsClean: true,
      noCData: true,
      noXIncNode: true,
      compact: true,
      old10: true,
      noBaseFix: true,
      huge: true,
      oldSax: true,
      ignoreEnc: true,
      bigLines: true,
      noXxe: true,
      unzip: true,
    };
    expect(parseXmlOptions(options)).toBe(0x01_ff_ff_ff);
  });
});
