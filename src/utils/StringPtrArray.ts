import { setValue, stringToNewUTF8 } from "../internal/emscripten";
import { malloc, free } from "../internal/main";
import { DataSegment } from "./DataSegment";
import { POINTER_SIZE, NULL_POINTER } from "../constants";

/**
 * An array of pointers to UTF-8 encoded strings or `.dataOffset` == `char**`
 */
class StringPtrArray extends DataSegment {
  stringPtrArray: number[] = [];
  isNullTerminated = false;

  static fromStringArray(
    stringArray: string[],
    isNullTerminated = false,
  ): StringPtrArray {
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

export { StringPtrArray };
