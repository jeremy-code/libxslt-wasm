import { XmlDocument } from "./XmlDocument.ts";
import { XmlOutputBuffer } from "./XmlOutputBuffer.ts";
import { NULL_POINTER } from "../constants.ts";
import type { Encoding } from "../interfaces.ts";
import {
  xsltApplyStylesheet,
  xsltLoadStylesheetPI,
  xsltFreeStylesheet,
  xsltParseStylesheetDoc,
  xsltSaveResultTo,
} from "../internal/libxslt.ts";
import { StringPtrArray } from "../utils/StringPtrArray.ts";

// If you see errors when passing params, considering double quoting params so
// they are considered literals rather than XPath expressions
const parseXsltParams = (
  params: Record<string, string> | undefined,
): number => {
  if (params === undefined) {
    return NULL_POINTER;
  }

  const entries = Object.entries(params);
  if (entries.length === 0) {
    return NULL_POINTER;
  }

  const paramArray = entries
    .map(([key, value]) => [key, String(value)])
    .flat(1);
  const paramsArrayPtr = StringPtrArray.fromStringArray(
    paramArray,
    true,
  ).dataOffset;

  if (paramsArrayPtr === null) {
    throw new Error("Failed to allocate memory for XSLT parameters");
  }

  return paramsArrayPtr;
};

class XsltStylesheet extends XmlDocument {
  /**
   * Assuming the XML document is a valid XSLT stylesheet, creates a new
   * instance of XsltStylesheet
   */
  static async fromXmlDocument(xmlDocument: XmlDocument) {
    if (xmlDocument.dataOffset === null) {
      throw new Error("XML document has already been disposed");
    }

    const xsltStylesheet = await xsltParseStylesheetDoc(xmlDocument.dataOffset);
    return new XsltStylesheet(xsltStylesheet);
  }

  /**
   * Given an XML document with an embedded XSLT stylesheet (e.g. a processing
   * instruction like <?xml-stylesheet?>), return the corresponding
   * XsltStylesheet instance
   */
  static async fromEmbeddedXmlDocument(xmlDocument: XmlDocument) {
    if (xmlDocument.dataOffset === null) {
      throw new Error("XML document has already been disposed");
    }

    const xsltStylesheetPtr = await xsltLoadStylesheetPI(
      xmlDocument.dataOffset,
    );

    return xsltStylesheetPtr === NULL_POINTER ? null : (
        new XsltStylesheet(xsltStylesheetPtr)
      );
  }

  static override async fromFileOrUrl(fileOrUrl: string) {
    return this.fromXmlDocument(await super.fromFileOrUrl(fileOrUrl));
  }

  static override async fromString(string: string) {
    return this.fromXmlDocument(await super.fromString(string));
  }

  static override async fromBuffer(
    buffer: ArrayBufferLike,
    options: Parameters<typeof this.from>[1],
  ) {
    return this.from(new Uint8Array(buffer), options);
  }

  static override async from(
    buffer: Uint8Array,
    {
      url,
      encoding,
      options,
    }: { url?: string; encoding?: Encoding | null; options?: number },
  ) {
    const xmlDocument = await super.from(buffer, { url, encoding, options });
    return this.fromXmlDocument(xmlDocument);
  }

  // Since `xsltApplyStylesheet()` uses `xmlXPathCompOpEval()` internally for
  // params, this must be async. Consider using `applyToOutputBuffer()` or
  // `applyToString()` for synchronous operations
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
    if (result === NULL_POINTER) {
      throw new Error("Failed to apply XSLT stylesheet to XML document");
    }
    return new XmlDocument(result);
  }

  applyToOutputBuffer(xmlDocument: XmlDocument) {
    if (this.dataOffset === null) {
      throw new Error("XSLT stylesheet has already been disposed");
    } else if (xmlDocument.dataOffset === null) {
      throw new Error("XML document has already been disposed");
    }

    const outputBuffer = XmlOutputBuffer.allocate();

    if (outputBuffer.dataOffset === null) {
      throw new Error("Failed to allocate memory for XML output buffer");
    }

    const bytesWritten = xsltSaveResultTo(
      outputBuffer.dataOffset,
      xmlDocument.dataOffset,
      this.dataOffset,
    );

    if (bytesWritten === -1) {
      throw new Error("Failed to save result to XML output buffer");
    }

    return outputBuffer;
  }

  applyToString(xmlDocument: XmlDocument) {
    const outputBuffer = this.applyToOutputBuffer(xmlDocument);
    const result = outputBuffer.toString();
    outputBuffer.delete();
    return result;
  }

  override delete() {
    if (this.dataOffset !== null) {
      xsltFreeStylesheet(this.dataOffset);
    }
    this.dataOffset = null;
    // Do NOT call `super.delete()` since `xmlFreeDoc()` will be called
  }
}

export { XsltStylesheet };
