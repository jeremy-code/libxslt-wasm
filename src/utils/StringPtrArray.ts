import { DataSegment } from "./DataSegment.ts";
import { POINTER_SIZE, NULL_POINTER } from "../constants.ts";
import { setValue, stringToNewUTF8 } from "../internal/emscripten.ts";
import { malloc, free } from "../internal/main.ts";

/**
 * An array of pointers to UTF-8 encoded strings or `.dataOffset` == `char**`.
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

    const stringPtrArrayPtr = malloc(
      stringPtrArray.length * POINTER_SIZE +
        (isNullTerminated ? POINTER_SIZE : 0),
    );
    stringPtrArray.forEach((stringPtr, index) => {
      setValue(stringPtrArrayPtr + index * POINTER_SIZE, stringPtr, "*");
    });

    // Not strictly necessary since `malloc()` initializes the memory to zero
    if (isNullTerminated) {
      setValue(
        stringPtrArrayPtr + stringPtrArray.length * POINTER_SIZE,
        NULL_POINTER,
        "*",
      );
      // Note, null pointer is NOT added to `stringPtrArray`
    }

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
    if (this.dataOffset !== null) {
      free(this.dataOffset);
    }
    this.stringPtrArray = [];
    super.delete();
  }
}

export { StringPtrArray };
