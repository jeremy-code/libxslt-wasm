import { describe, expect, test } from "@jest/globals";

import { XmlOutputBuffer } from "./XmlOutputBuffer.ts";
import { NULL_POINTER } from "../constants.ts";
import { lengthBytesUTF8 } from "../internal/emscripten.ts";

describe("XmlOutputBuffer", () => {
  describe(".allocate()", () => {
    test("should allocate a new XML output buffer", () => {
      const buffer = XmlOutputBuffer.allocate();
      expect(buffer.byteOffset).not.toBe(NULL_POINTER);
      expect(buffer.size).toBe(0);
      expect(buffer.toString()).toBe("");
      buffer.delete();
    });
  });
  describe(".writeString()", () => {
    test("should write a string to the XML output buffer", () => {
      const stringToWriteToBuffer = "Hello, world!";
      const buffer = XmlOutputBuffer.allocate();
      buffer.writeString(stringToWriteToBuffer);
      expect(buffer.size).toBe(lengthBytesUTF8(stringToWriteToBuffer));
      expect(buffer.toString()).toBe(stringToWriteToBuffer);
      buffer.delete();
    });

    test("should write multiple strings to the XML output buffer", () => {
      const stringsToWriteToBuffer = ["tac", "o", "cat"];
      const expectedString = stringsToWriteToBuffer.join("");
      const buffer = XmlOutputBuffer.allocate();
      stringsToWriteToBuffer.forEach((str) => {
        buffer.writeString(str);
      });
      expect(buffer.size).toBe(lengthBytesUTF8(expectedString));
      expect(buffer.toString()).toBe(expectedString);
      buffer.delete();
    });
  });
});
