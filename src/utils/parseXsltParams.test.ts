import { describe, expect, it } from "@jest/globals";

import { parseXsltParams } from "./parseXsltParams.ts";
import { UTF8ToString } from "../internal/emscripten.ts";

describe("parseXsltParams()", () => {
  it("returns NULL_POINTER (0) if params is undefined", () => {
    expect(parseXsltParams(undefined)).toBeNull();
  });
  it("returns NULL_POINTER (0) if params is an empty object", () => {
    expect(parseXsltParams({})).toBeNull();
  });
  it("returns a StringPtrArray if params is a non-empty object", () => {
    const xsltParams = parseXsltParams({ param1: "value1", param2: "value2" });
    expect(xsltParams).not.toBeNull();
    expect(
      xsltParams?.stringPtrArray?.map((stringPtr) => UTF8ToString(stringPtr)),
    ).toEqual(["param1", "value1", "param2", "value2"]);
    xsltParams?.delete();
  });
});
