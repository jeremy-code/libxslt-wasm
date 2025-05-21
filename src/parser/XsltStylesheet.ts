import { XmlDocument, type XmlDocumentBaseOptions } from "./XmlDocument.ts";
import { XmlOutputBuffer } from "./XmlOutputBuffer.ts";
import { NULL_POINTER } from "../constants.ts";
import {
  xsltApplyStylesheet,
  xsltLoadStylesheetPI,
  xsltFreeStylesheet,
  xsltParseStylesheetDoc,
  xsltSaveResultTo,
} from "../internal/libxslt.ts";
import { parseXsltParams } from "../utils/parseXsltParams.ts";

class XsltStylesheet extends XmlDocument {
  /**
   * Assuming the XML document is a valid XSLT stylesheet, creates a new
   * instance of XsltStylesheet
   */
  static async fromXmlDocument(xmlDocument: XmlDocument) {
    const xsltStylesheet = await xsltParseStylesheetDoc(xmlDocument.byteOffset);
    return new XsltStylesheet(xsltStylesheet);
  }

  /**
   * Given an XML document with an embedded XSLT stylesheet (e.g. a processing
   * instruction like <?xml-stylesheet?>), return the corresponding
   * XsltStylesheet instance
   */
  static async fromEmbeddedXmlDocument(xmlDocument: XmlDocument) {
    const xsltStylesheetPtr = await xsltLoadStylesheetPI(
      xmlDocument.byteOffset,
    );

    return xsltStylesheetPtr === NULL_POINTER ? null : (
        new XsltStylesheet(xsltStylesheetPtr)
      );
  }

  static override async fromUrl(fileOrUrl: string) {
    return this.fromXmlDocument(await super.fromUrl(fileOrUrl));
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
    { url, encoding, options }: XmlDocumentBaseOptions & { url?: string } = {},
  ) {
    const xmlDocument = await super.from(buffer, { url, encoding, options });
    return this.fromXmlDocument(xmlDocument);
  }

  // Since `xsltApplyStylesheet()` uses `xmlXPathCompOpEval()` internally for
  // params, this must be async. Consider using `applyToOutputBuffer()` or
  // `applyToString()` for synchronous operations
  async apply(xmlDocument: XmlDocument, params?: Record<string, string>) {
    const xsltParams = parseXsltParams(params);

    const result = await xsltApplyStylesheet(
      this.byteOffset,
      xmlDocument.byteOffset,
      xsltParams !== null ? xsltParams.byteOffset : NULL_POINTER,
    );
    xsltParams?.delete();
    if (result === NULL_POINTER) {
      throw new Error("Failed to apply XSLT stylesheet to XML document");
    }
    return new XmlDocument(result);
  }

  applyToOutputBuffer(xmlDocument: XmlDocument) {
    const outputBuffer = XmlOutputBuffer.allocate();

    const bytesWritten = xsltSaveResultTo(
      outputBuffer.byteOffset,
      xmlDocument.byteOffset,
      this.byteOffset,
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
    if (this.byteOffset !== null) {
      xsltFreeStylesheet(this.byteOffset);
    }
  }
}

export { XsltStylesheet };
