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
    const encodingPtr = encoding ? stringToNewUTF8(encoding) : NULL_POINTER;
    const urlPtr = stringToNewUTF8(url);
    const xmlDocument = new XmlDocument(
      await xmlReadFile(urlPtr, encodingPtr, parseXmlOptions(options ?? {})),
    );
    if (encodingPtr !== NULL_POINTER) {
      free(encodingPtr);
    }
    free(urlPtr);
    return xmlDocument;
  }

  static async fromString(
    xmlString: string,
    { encoding, url, options }: XmlDocumentBaseOptions & { url?: string } = {},
  ) {
    const xmlStringPtr =
      xmlString !== "" ? stringToNewUTF8(xmlString) : NULL_POINTER;
    const urlPtr = url ? stringToNewUTF8(url) : NULL_POINTER;
    const encodingPtr = encoding ? stringToNewUTF8(encoding) : NULL_POINTER;

    const xmlDocument = new XmlDocument(
      await xmlReadDoc(
        xmlStringPtr,
        urlPtr,
        encodingPtr,
        parseXmlOptions(options ?? {}),
      ),
    );
    if (encodingPtr !== NULL_POINTER) {
      free(encodingPtr);
    }
    if (urlPtr !== NULL_POINTER) {
      free(urlPtr);
    }
    free(xmlStringPtr);
    return xmlDocument;
  }

  static async fromBuffer(
    buffer: ArrayBufferLike,
    options: Parameters<typeof this.from>[1],
  ) {
    return this.from(new Uint8Array(buffer), options);
  }

  static async from(
    buffer: Uint8Array,
    { url, encoding, options }: XmlDocumentBaseOptions & { url?: string } = {},
  ) {
    const bufferPtr = malloc(buffer.byteLength);
    HEAPU8.set(buffer, bufferPtr);

    const urlPtr = url ? stringToNewUTF8(url) : NULL_POINTER;
    const encodingPtr = encoding ? stringToNewUTF8(encoding) : NULL_POINTER;

    return new XmlDocument(
      await xmlReadMemory(
        bufferPtr,
        buffer.byteLength,
        urlPtr,
        encodingPtr,
        parseXmlOptions(options ?? {}),
      ),
    );
  }

  override delete() {
    xmlFreeDoc(this.byteOffset);
  }

  /**
   * Formats the XML document as a string by dumping the XML tree to an
   * {@link XmlOutputBuffer} and returning its string representation.
   */
  override toString(options?: { format?: boolean; encoding?: Encoding }) {
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

    const xmlString = xmlOutputBuffer.toString();
    xmlOutputBuffer.delete();

    return xmlString;
  }

  /**
   * Assuming the document is an HTML tree, dumps the document to an
   * {@link XmlOutputBuffer} and returns the output buffer
   */
  toHtmlOutputBuffer(options?: { format?: boolean; encoding?: Encoding }) {
    const xmlOutputBuffer = XmlOutputBuffer.allocate();
    const encodingPtr =
      options?.encoding ? stringToNewUTF8(options.encoding) : NULL_POINTER;

    htmlDocContentDumpFormatOutput(
      xmlOutputBuffer.byteOffset,
      this.byteOffset,
      encodingPtr,
      options?.format ? 1 : 0,
    );

    if (encodingPtr !== NULL_POINTER) {
      free(encodingPtr);
    }
    return xmlOutputBuffer;
  }

  /**
   * Assuming the document is an HTML tree, serializes the document via
   * {@link toHtmlOutputBuffer} and returns the string
   */
  toHtmlString(options?: { format?: boolean; encoding?: Encoding }) {
    const xmlOutputBuffer = this.toHtmlOutputBuffer(options);

    const xmlString = xmlOutputBuffer.toString();
    xmlOutputBuffer.delete();
    return xmlString;
  }
}

export { type XmlDocumentBaseOptions, XmlDocument };
