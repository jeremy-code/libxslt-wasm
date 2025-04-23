import { XmlOutputBuffer } from "./XmlOutputBuffer";
import { NULL_POINTER } from "../constants";
import type { Encoding } from "../interfaces";
import { stringToNewUTF8 } from "../internal/emscripten";
import {
  xmlReadFile,
  xmlReadDoc,
  xmlNodeDumpOutput,
  xmlFreeDoc,
  htmlDocContentDumpFormatOutput,
} from "../internal/libxml2";
import { free } from "../internal/main";
import { DataSegment } from "../utils/DataSegment";

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

  delete() {
    if (this.dataOffset !== null) {
      xmlFreeDoc(this.dataOffset);
    }
    super.delete();
  }

  toString(options?: { format?: boolean; encoding?: Encoding }) {
    if (this.dataOffset === null) {
      throw new Error("XML document has already been disposed");
    }

    const xmlOutputBuffer = XmlOutputBuffer.allocate();
    const encodingPtr =
      options?.encoding ? stringToNewUTF8(options.encoding) : null;

    if (xmlOutputBuffer.dataOffset === null) {
      throw new Error("Failed to allocate memory for XML output buffer");
    }

    /**
     * Since `xmlDocPtr` is a super pointer to `xmlNodePtr`, it can be passed to
     * `cur`. While this usage may be suspect, this technique is used for for
     * `htmlDocContentDumpOutput`.
     *
     * @see {@link https://github.com/GNOME/libxml2/blob/master/HTMLtree.c#L938-L942}
     */
    xmlNodeDumpOutput(
      xmlOutputBuffer.dataOffset,
      /* doc */ this.dataOffset,
      /* cur */ this.dataOffset,
      /* level */ 0,
      options?.format ? 1 : 0,
      /* encoding */ encodingPtr ?? NULL_POINTER,
    );

    if (encodingPtr !== null) {
      free(encodingPtr);
    }
    const xmlString = xmlOutputBuffer.toString();
    xmlOutputBuffer.delete();

    return xmlString;
  }

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

  toHtmlString(options?: { format?: boolean; encoding?: Encoding }) {
    const xmlOutputBuffer = this.toHtmlOutputBuffer(options);

    const xmlString = xmlOutputBuffer.toString();
    xmlOutputBuffer.delete();
    return xmlString;
  }
}

export { XmlDocument };
