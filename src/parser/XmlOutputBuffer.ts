import { NULL_POINTER } from "../constants";
import { UTF8ToString } from "../internal/emscripten";
import {
  xmlAllocOutputBuffer,
  xmlOutputBufferGetSize,
  xmlOutputBufferGetContent,
  xmlOutputBufferClose,
  xmlCharEncoding,
} from "../internal/libxml2";

import { DataSegment } from "../utils/DataSegment";

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

  get size() {
    return this.dataOffset !== null
      ? xmlOutputBufferGetSize(this.dataOffset)
      : 0;
  }

  toString() {
    if (this.dataOffset === null) {
      throw new Error("XML output buffer already disposed");
    }

    const content = xmlOutputBufferGetContent(this.dataOffset);
    const outputString = UTF8ToString(content);

    return outputString;
  }

  delete() {
    if (this.dataOffset === null) {
      throw new Error("XML output buffer already disposed");
    }

    const bytesWritten = xmlOutputBufferClose(this.dataOffset);

    if (bytesWritten < 0) {
      throw new Error(
        `XML Parser Errors ${Math.abs(
          bytesWritten,
        )}: Failed to close XML output buffer`,
      );
    }
    super.delete();
  }
}

export { XmlOutputBuffer };
