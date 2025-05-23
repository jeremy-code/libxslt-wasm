import { describe, expect, test } from "@jest/globals";

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
