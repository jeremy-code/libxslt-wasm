import { stringToNewUTF8 } from "../internal/emscripten";
import {
  xmlReadFile,
  xmlReadDoc,
  xmlNodeDumpOutput,
  xmlFreeDoc,
} from "../internal/libxml2";

import { XmlOutputBuffer } from "./XmlOutputBuffer";

import { DataSegment } from "../utils/DataSegment";

import type { Encoding } from "../interfaces";
import { free } from "../internal/main";

export class XmlDocument extends DataSegment {
  static async fromFileOrUrl(
    fileOrUrl: string,
    encoding: Encoding | null = null,
  ) {
    const encodingPtr: number = encoding ? stringToNewUTF8(encoding) : 0;
    const fileOrUrlPtr = stringToNewUTF8(fileOrUrl);
    const xmlDocument = new XmlDocument(
      await xmlReadFile(fileOrUrlPtr, encodingPtr, 1 | 2 | 4 | 8 | 1024),
    );
    if (encodingPtr !== 0) {
      free(encodingPtr);
    }
    free(fileOrUrlPtr);
    return xmlDocument;
  }

  static async fromString(xmlString: string) {
    const xmlStringPtr = stringToNewUTF8(xmlString);

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
      throw new Error("Document pointer is null");
    }

    const xmlOutputBuffer = XmlOutputBuffer.allocate();
    const encodingPtr = options?.encoding
      ? stringToNewUTF8(options.encoding)
      : null;

    /**
     * @see {@link https://github.com/GNOME/libxml2/blob/master/HTMLtree.c#L938-L942}
     */
    xmlNodeDumpOutput(
      Number(xmlOutputBuffer.dataOffset),
      /* doc */ this.dataOffset,
      /* cur */ this.dataOffset,
      /* level */ 0,
      options?.format ? 1 : 0,
      /* encoding */ Number(encodingPtr),
    );

    if (encodingPtr !== null) {
      free(encodingPtr);
    }
    const xmlString = xmlOutputBuffer.toString();
    xmlOutputBuffer.delete();

    return xmlString;
  }
}
