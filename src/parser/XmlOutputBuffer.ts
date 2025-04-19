import { UTF8ToString } from "../internal/emscripten";
import {
  xmlAllocOutputBuffer,
  xmlOutputBufferGetSize,
  xmlOutputBufferGetContent,
  xmlOutputBufferClose,
} from "../internal/libxml2";

import { DataSegment } from "../utils/DataSegment";

export class XmlOutputBuffer extends DataSegment {
  static allocate() {
    const bufferPtr = xmlAllocOutputBuffer(Number(null));
    if (bufferPtr === 0) {
      throw new ReferenceError("failed to allocate XML output buffer");
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
      throw new Error("Buffer already disposed");
    }

    const content = xmlOutputBufferGetContent(this.dataOffset);
    const outputString = UTF8ToString(content);

    return outputString;
  }

  delete() {
    if (this.dataOffset === null) {
      throw new Error("Buffer already disposed");
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
