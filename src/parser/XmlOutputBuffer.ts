import { DataSegment } from "../common/DataSegment.ts";
import { NULL_POINTER } from "../constants.ts";
import { stringToNewUTF8, UTF8ToString } from "../internal/emscripten.ts";
import {
  xmlAllocOutputBuffer,
  xmlOutputBufferGetSize,
  xmlOutputBufferGetContent,
  xmlOutputBufferClose,
  xmlCharEncoding,
  xmlOutputBufferWriteString,
} from "../internal/libxml2.ts";
import { free } from "../internal/main.ts";

class XmlOutputBuffer extends DataSegment {
  /**
   * Allocate a new XML output buffer (`xmlOutputBufferPtr`) and return the
   * wrapper class
   */
  static allocate(encoding: keyof typeof xmlCharEncoding = "NONE") {
    const bufferPtr = xmlAllocOutputBuffer(xmlCharEncoding[encoding].value);
    if (bufferPtr === NULL_POINTER) {
      throw new ReferenceError(
        "Failed to allocate memory for XML output buffer",
      );
    }
    return new XmlOutputBuffer(bufferPtr);
  }

  /**
   * Returns length of the data currently held in the output buffer
   */
  get size() {
    return xmlOutputBufferGetSize(this.byteOffset);
  }

  writeString(str: string): void {
    if (this.byteOffset === null) {
      throw new Error("XML output buffer already disposed");
    }

    const strPtr = stringToNewUTF8(str);

    const bytesWritten = xmlOutputBufferWriteString(this.byteOffset, strPtr);
    free(strPtr);

    if (bytesWritten === -1) {
      throw new Error(`Failed to write ${str} to XML output buffer`);
    }
  }

  override toString() {
    if (this.byteOffset === null) {
      throw new Error("XML output buffer already disposed");
    }

    const content = xmlOutputBufferGetContent(this.byteOffset);
    const outputString = UTF8ToString(content);

    return outputString;
  }

  override delete() {
    if (this.byteOffset === null) {
      throw new Error("XML output buffer already disposed");
    }

    const bytesWritten = xmlOutputBufferClose(this.byteOffset);

    if (bytesWritten < 0) {
      // bytesWritten is negative of enum `xmlParserErrors`
      throw new Error(
        `XML Parser Errors ${Math.abs(
          bytesWritten,
        )}: Failed to close XML output buffer`,
      );
    }
  }
}

export { XmlOutputBuffer };
