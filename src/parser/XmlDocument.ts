import { XmlOutputBuffer } from "./XmlOutputBuffer.ts";
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
import { DataSegment } from "../utils/DataSegment.ts";

/**
 * A wrapper class for `xmlDocPtr` in libxml2
 */
class XmlDocument extends DataSegment {
  static async fromFileOrUrl(
    fileOrUrl: string,
    encoding: Encoding | null = null,
  ) {
    const encodingPtr: number | null =
      encoding ? stringToNewUTF8(encoding) : null;
    const fileOrUrlPtr = stringToNewUTF8(fileOrUrl);
    const xmlDocument = new XmlDocument(
      await xmlReadFile(
        fileOrUrlPtr,
        encodingPtr ?? NULL_POINTER,
        1 | 2 | 4 | 8 | 1024,
      ),
    );
    if (encodingPtr !== null) {
      free(encodingPtr);
    }
    free(fileOrUrlPtr);
    return xmlDocument;
  }

  static async fromString(xmlString: string) {
    const xmlStringPtr =
      xmlString !== "" ? stringToNewUTF8(xmlString) : NULL_POINTER;

    const xmlDocument = new XmlDocument(
      await xmlReadDoc(xmlStringPtr, 0, 0, 1 | 2 | 4 | 8 | 1024),
    );
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
    {
      url,
      encoding,
      options,
    }: { url?: string; encoding?: Encoding | null; options?: number },
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
        options ?? 1 | 2 | 4 | 8 | 1024,
      ),
    );
  }

  override delete() {
    xmlFreeDoc(this.dataOffset ?? NULL_POINTER);
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
      xmlOutputBuffer.dataOffset ?? NULL_POINTER,
      /* doc */ this.dataOffset ?? NULL_POINTER,
      /* cur */ this.dataOffset ?? NULL_POINTER,
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
    if (this.dataOffset === null) {
      throw new Error("XML document has already been disposed");
    }
    const xmlOutputBuffer = XmlOutputBuffer.allocate();
    const encodingPtr =
      options?.encoding ? stringToNewUTF8(options.encoding) : null;

    if (xmlOutputBuffer.dataOffset === null) {
      throw new Error("Failed to allocate memory for output buffer");
    }

    htmlDocContentDumpFormatOutput(
      xmlOutputBuffer.dataOffset,
      this.dataOffset,
      encodingPtr ?? NULL_POINTER,
      options?.format ? 1 : 0,
    );

    if (encodingPtr !== null) {
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

export { XmlDocument };
