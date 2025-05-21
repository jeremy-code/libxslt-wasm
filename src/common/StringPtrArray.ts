import { DataSegment } from "./DataSegment.ts";
import { POINTER_SIZE } from "../constants.ts";
import { setValue, stringToNewUTF8 } from "../internal/emscripten.ts";
import { free, calloc } from "../internal/main.ts";

/**
 * An array of pointers to UTF-8 encoded strings or `.byteOffset` == `char**`.
 * May be null terminated
 */
class StringPtrArray extends DataSegment {
  stringPtrArray: number[] = [];
  isNullTerminated = false;

  static fromStringArray(
    stringArray: string[],
    isNullTerminated = false,
  ): StringPtrArray {
    if (stringArray.length === 0) {
      throw new Error(
        "StringPtrArray.fromStringArray array must have a length",
      );
    }

    const stringPtrArray = stringArray.map((str): number =>
      stringToNewUTF8(str),
    );
    const stringPtrArrayPtr = calloc(
      stringPtrArray.length + (isNullTerminated ? 1 : 0),
      POINTER_SIZE,
    );
    stringPtrArray.forEach((stringPtr, index) => {
      setValue(stringPtrArrayPtr + index * POINTER_SIZE, stringPtr, "*");
    });

    return Object.assign(new StringPtrArray(stringPtrArrayPtr), {
      stringPtrArray: stringPtrArray,
      isNullTerminated: isNullTerminated,
    });
  }

  // Aligns with `TypedArray` API
  get byteLength() {
    return (
      this.stringPtrArray.length * POINTER_SIZE +
      (this.isNullTerminated ? POINTER_SIZE : 0)
    );
  }

  override delete() {
    this.stringPtrArray.forEach((stringPtr) => {
      free(stringPtr);
    });
    free(this.byteOffset);
    this.stringPtrArray = [];
  }
}

export { StringPtrArray };
