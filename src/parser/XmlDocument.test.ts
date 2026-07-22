import { describe, expect, test } from "vitest";

import { XmlDocument } from "./XmlDocument.ts";
import { NULL_POINTER } from "../constants.ts";

const TEST_XML_STRING = `<?xml version="1.0" encoding="UTF-8"?>
<root/>
`;

describe("XmlDocument", () => {
  describe(".fromString()", () => {
    test("should create an XMLDocument from a string", async () => {
      const xmlDocument = await XmlDocument.fromString(TEST_XML_STRING);
      expect(xmlDocument.byteOffset).not.toBe(NULL_POINTER);
      expect(xmlDocument.toString()).toBe(TEST_XML_STRING);
      xmlDocument.delete();
    });
  });

  describe(".fromBuffer()", () => {
    test("should create an XMLDocument from a buffer", async () => {
      const data = Buffer.from(TEST_XML_STRING, "utf-8");
      const buffer = new ArrayBuffer(data.byteLength);
      new Uint8Array(buffer).set(data);

      const xmlDocument = await XmlDocument.fromBuffer(buffer, {
        url: "test.xml",
        encoding: "UTF-8",
        options: { pedantic: true },
      });
      expect(xmlDocument.byteOffset).not.toBe(NULL_POINTER);
      expect(xmlDocument.toString()).toBe(TEST_XML_STRING);
      xmlDocument.delete();
    });
  });

  describe(".from()", () => {
    test("should create an XMLDocument from a Uint8Array", async () => {
      const buffer = Buffer.from(TEST_XML_STRING, "utf-8");
      const xmlDocument = await XmlDocument.from(buffer, {
        url: "test.xml",
        encoding: "UTF-8",
        options: { pedantic: true },
      });
      expect(xmlDocument.byteOffset).not.toBe(NULL_POINTER);
      expect(xmlDocument.toString()).toBe(TEST_XML_STRING);
      xmlDocument.delete();
    });
  });
});
