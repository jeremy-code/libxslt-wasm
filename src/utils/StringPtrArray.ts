import {
  getNativeTypeSize,
  setValue,
  stringToNewUTF8,
} from "../internal/emscripten";
import { malloc, free } from "../internal/main";

import { DataSegment } from "./DataSegment";

// 4 bytes by default, 8 bytes if `MEMORY64` is enabled
// https://emscripten.org/docs/tools_reference/settings_reference.html#memory64
const POINTER_SIZE = getNativeTypeSize("*");

export class StringPtrArray extends DataSegment {
  stringPtrArray: number[] = [];
  isNullTerminated = false;

  static fromStringArray(stringArray: string[], isNullTerminated = false) {
    if (stringArray.length === 0) {
      throw new Error("String array is empty");
    }

    const stringPtrArray = stringArray.map((str): number =>
      stringToNewUTF8(str),
    );

    const stringPtrArrayPtr = malloc(
      stringPtrArray.length * POINTER_SIZE +
        (isNullTerminated ? POINTER_SIZE : 0),
    );

    const stringPtrArrayInstance = new StringPtrArray(stringPtrArrayPtr);

    stringPtrArrayInstance.stringPtrArray = stringPtrArray;
    stringPtrArrayInstance.isNullTerminated = isNullTerminated;

    stringPtrArray.forEach((stringPtr, index) => {
      setValue(stringPtrArrayPtr + index * POINTER_SIZE, stringPtr, "*");
    });

    // Not strictly necessary since `malloc` initializes the memory to zero
    if (isNullTerminated) {
      setValue(
        stringPtrArrayPtr + stringPtrArray.length * POINTER_SIZE,
        0,
        "*",
      );
    }

    return stringPtrArrayInstance;
  }

  delete() {
    this.stringPtrArray.forEach((stringPtr) => {
      free(stringPtr);
    });
    if (this.dataOffset !== null) {
      free(this.dataOffset);
    }
    super.delete();
  }
}
