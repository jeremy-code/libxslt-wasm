import { XmlOutputBuffer } from "./XmlOutputBuffer.ts";
import { DataSegment } from "../common/DataSegment.ts";
import { NULL_POINTER } from "../constants.ts";
import type { Encoding } from "../interfaces.ts";
import { stringToNewUTF8, HEAPU8 } from "../internal/emscripten.ts";
import {
  xmlReadFile,
  xmlReadDoc,
  xmlReadMemory,
  xmlNodeDumpOutput,
  xmlFreeDoc,
  htmlDocContentDumpFormatOutput,
} from "../internal/libxml2.ts";
import { free, malloc } from "../internal/main.ts";
import { parseXmlOptions, type XmlOption } from "../utils/parseXmlOptions.ts";

type XmlDocumentBaseOptions = {
  encoding?: Encoding;
  options?: Partial<Record<XmlOption, boolean>>;
};

/**
 * A wrapper class for `xmlDocPtr` in libxml2
 */
class XmlDocument extends DataSegment {
  static async fromUrl(
    url: string,
    { encoding, options }: XmlDocumentBaseOptions = {},
  ) {
    const encodingPtr = encoding ? stringToNewUTF8(encoding) : null;
    const urlPtr = stringToNewUTF8(url);
    const xmlDocumentPtr = await xmlReadFile(
      urlPtr,
      encodingPtr ?? NULL_POINTER,
      parseXmlOptions(options ?? {}),
    );

    if (encodingPtr !== null) {
      free(encodingPtr);
    }
    free(urlPtr);

    if (xmlDocumentPtr === NULL_POINTER) {
      throw new Error("Invalid XMLDocument");
    }
    return new XmlDocument(xmlDocumentPtr);
  }

  static async fromString(
    xmlString: string,
    { encoding, url, options }: XmlDocumentBaseOptions & { url?: string } = {},
  ) {
    const xmlStringPtr = stringToNewUTF8(xmlString);
    const urlPtr = url ? stringToNewUTF8(url) : null;
    const encodingPtr = encoding ? stringToNewUTF8(encoding) : null;

    const xmlDocumentPtr = await xmlReadDoc(
      xmlStringPtr ?? NULL_POINTER,
      urlPtr ?? NULL_POINTER,
      encodingPtr ?? NULL_POINTER,
      parseXmlOptions(options ?? {}),
    );

    free(xmlStringPtr);
    if (encodingPtr !== null) {
      free(encodingPtr);
    }
    if (urlPtr !== null) {
      free(urlPtr);
    }

    if (xmlDocumentPtr === NULL_POINTER) {
      throw new Error("Invalid XMLDocument");
    }
    return new XmlDocument(xmlDocumentPtr);
  }

  static async fromBuffer(
    buffer: ArrayBufferLike,
    options: Parameters<typeof this.from>[1],
  ) {
    return this.from(new Uint8Array(buffer), options);
  }

  static async from(
    data: Uint8Array,
    { url, encoding, options }: XmlDocumentBaseOptions & { url?: string } = {},
  ) {
    const bufferPtr = malloc(data.byteLength);
    HEAPU8.set(data, bufferPtr);

    const urlPtr = url ? stringToNewUTF8(url) : null;
    const encodingPtr = encoding ? stringToNewUTF8(encoding) : null;

    const xmlDocumentPtr = await xmlReadMemory(
      bufferPtr,
      data.byteLength,
      urlPtr ?? NULL_POINTER,
      encodingPtr ?? NULL_POINTER,
      parseXmlOptions(options ?? {}),
    );

    if (encodingPtr !== null) {
      free(encodingPtr);
    }
    if (urlPtr !== null) {
      free(urlPtr);
    }
    free(bufferPtr);

    if (xmlDocumentPtr === NULL_POINTER) {
      throw new Error("Invalid XMLDocument");
    }

    return new XmlDocument(xmlDocumentPtr);
  }

  override delete() {
    if (this.byteOffset !== NULL_POINTER) {
      xmlFreeDoc(this.byteOffset);
    }
  }

  toXmlOutputBuffer(options?: { format?: boolean; encoding?: Encoding }) {
    const xmlOutputBuffer = XmlOutputBuffer.allocate();
    const encodingPtr =
      options?.encoding ? stringToNewUTF8(options.encoding) : null;

    /**
     * Since `xmlDocPtr` is a super pointer to `xmlNodePtr`, it can be passed to
     * `cur`. While this usage may be suspect, this technique is used for for
     * `htmlDocContentDumpOutput`.
     *
     * @see {@link https://gitlab.gnome.org/GNOME/libxml2/-/blob/master/HTMLtree.c#L938-942}
     */
    xmlNodeDumpOutput(
      xmlOutputBuffer.byteOffset ?? NULL_POINTER,
      /* doc */ this.byteOffset ?? NULL_POINTER,
      /* cur */ this.byteOffset ?? NULL_POINTER,
      /* level */ 0,
      options?.format ? 1 : 0,
      /* encoding */ encodingPtr ?? NULL_POINTER,
    );

    if (encodingPtr !== NULL_POINTER) {
      free(encodingPtr);
    }
    return xmlOutputBuffer;
  }

  /**
   * Formats the XML document as a string by dumping the XML tree to an
   * {@link XmlOutputBuffer} and returning its string representation.
   */
  override toString(options?: { format?: boolean; encoding?: Encoding }) {
    const xmlOutputBuffer = this.toXmlOutputBuffer(options);
    const xmlString = xmlOutputBuffer.toString();
    xmlOutputBuffer.delete();

    return xmlString;
  }

  /**
   * Assuming the document is an HTML tree, dumps the document to an
   * {@link XmlOutputBuffer} and returns the output buffer
   */
  toHtmlOutputBuffer(options?: { format?: boolean; encoding?: Encoding }) {
    const htmlOutputBuffer = XmlOutputBuffer.allocate();
    const encodingPtr =
      options?.encoding ? stringToNewUTF8(options.encoding) : null;

    htmlDocContentDumpFormatOutput(
      htmlOutputBuffer.byteOffset,
      this.byteOffset,
      encodingPtr ?? NULL_POINTER,
      options?.format ? 1 : 0,
    );

    if (encodingPtr !== null) {
      free(encodingPtr);
    }
    return htmlOutputBuffer;
  }

  /**
   * Assuming the document is an HTML tree, serializes the document via
   * {@link toHtmlOutputBuffer} and returns the string
   */
  toHtmlString(options?: { format?: boolean; encoding?: Encoding }) {
    const htmlOutputBuffer = this.toHtmlOutputBuffer(options);

    const xmlString = htmlOutputBuffer.toString();
    htmlOutputBuffer.delete();
    return xmlString;
  }
}

export { type XmlDocumentBaseOptions, XmlDocument };
