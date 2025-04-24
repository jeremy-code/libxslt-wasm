import { describe, expect, test } from "@jest/globals";

import { XmlOutputBuffer } from "./XmlOutputBuffer.ts";
import { POINTER_SIZE } from "../constants.ts";
import { lengthBytesUTF8 } from "../internal/emscripten.ts";

describe("XmlOutputBuffer", () => {
  describe(".allocate()", () => {
    test("should allocate a new XML output buffer", () => {
      const buffer = XmlOutputBuffer.allocate();
      expect(buffer.dataOffset).not.toBeNull();
      expect(buffer.size).toBe(0);
      expect(buffer.toString()).toBe("");
      buffer.delete();
    });
  });
  describe(".write()", () => {
    test("should write a string to the XML output buffer", () => {
      const stringToWriteToBuffer = "Hello, world!";
      const buffer = XmlOutputBuffer.allocate();
      buffer.write(stringToWriteToBuffer);
      expect(buffer.size).toBe(
        lengthBytesUTF8(stringToWriteToBuffer) + POINTER_SIZE,
      );
      expect(buffer.toString()).toBe(stringToWriteToBuffer);
      buffer.delete();
    });

    test("should throw an error if the buffer is disposed", () => {
      const buffer = XmlOutputBuffer.allocate();
      buffer.delete();
      expect(() => {
        buffer.write("Hello, world!");
      }).toThrow("XML output buffer already disposed");
    });
  });
});
