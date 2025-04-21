import {
  xsltApplyStylesheet,
  xsltLoadStylesheetPI,
  xsltFreeStylesheet,
  xsltParseStylesheetDoc,
} from "../internal/libxslt.ts";
import { StringPtrArray } from "../utils/StringPtrArray";

import { XmlDocument } from "./XmlDocument";

const parseXsltParams = (
  params: Record<string, string> | undefined,
): number => {
  if (params === undefined) {
    return Number(null);
  }

  const entries = Object.entries(params);
  if (entries.length === 0) {
    return Number(null);
  }

  const paramArray = entries
    .map(([key, value]) => [key, String(value)])
    .flat(1);
  const stringPtrArray = StringPtrArray.fromStringArray(paramArray, true);
  const paramsArrayPtr = stringPtrArray.dataOffset;

  if (paramsArrayPtr === null) {
    throw new Error("Failed to allocate memory for XSLT parameters");
  }

  return paramsArrayPtr;
};

export class XsltStylesheet extends XmlDocument {
  static async fromXmlDocument(xmlDocument: XmlDocument) {
    if (xmlDocument.dataOffset === null) {
      throw new Error("XML document has already been disposed");
    }

    const xsltStylesheet = await xsltParseStylesheetDoc(xmlDocument.dataOffset);
    return new XsltStylesheet(xsltStylesheet);
  }

  static async fromEmbeddedXmlDocument(xmlDocument: XmlDocument) {
    if (xmlDocument.dataOffset === null) {
      throw new Error("XML document has already been disposed");
    }

    const xsltStylesheetPtr = await xsltLoadStylesheetPI(
      xmlDocument.dataOffset,
    );

    return xsltStylesheetPtr === 0
      ? null
      : new XsltStylesheet(xsltStylesheetPtr);
  }

  static async fromFileOrUrl(fileOrUrl: string) {
    return this.fromXmlDocument(await super.fromFileOrUrl(fileOrUrl));
  }

  static async fromString(string: string) {
    return this.fromXmlDocument(await super.fromString(string));
  }

  async apply(xmlDocument: XmlDocument, params?: Record<string, string>) {
    if (this.dataOffset === null) {
      throw new Error("XSLT stylesheet has already been disposed");
    } else if (xmlDocument.dataOffset === null) {
      throw new Error("XML document has already been disposed");
    }

    const result = await xsltApplyStylesheet(
      this.dataOffset,
      xmlDocument.dataOffset,
      parseXsltParams(params),
    );
    if (result === 0) {
      throw new Error("Failed to apply stylesheet");
    }
    return new XmlDocument(result);
  }

  delete() {
    if (this.dataOffset !== null) {
      xsltFreeStylesheet(this.dataOffset);
    }
    this.dataOffset = null;
    // Do NOT run `super.delete()` since xmlFreeDoc will be called
  }
}
