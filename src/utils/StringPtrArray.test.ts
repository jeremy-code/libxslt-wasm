import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";

import { StringPtrArray } from "./StringPtrArray.ts";
import { NULL_POINTER, POINTER_SIZE } from "../constants.ts";
import { getValue, UTF8ToString } from "../internal/emscripten.ts";

describe("StringPtrArray", () => {
  describe(".fromStringArray([])", () => {
    test("should throw an error", () => {
      expect(() => {
        StringPtrArray.fromStringArray([]);
      }).toThrow("StringPtrArray.fromStringArray array must have a length");
    });
  });
  describe.each([
    { stringArray: ["foo", "bar", "baz", "qux"], isNullTerminated: false },
    { stringArray: ["hello", "world"], isNullTerminated: true },
  ])(
    ".fromStringArray($stringArray, $isNullTerminated)",
    ({ stringArray, isNullTerminated }) => {
      let stringPtrArrayInstance: StringPtrArray;

      beforeAll(() => {
        stringPtrArrayInstance = StringPtrArray.fromStringArray(
          stringArray,
          isNullTerminated,
        );
      });

      afterAll(() => {
        stringPtrArrayInstance.delete();
      });

      test(".dataOffset should not be null", () => {
        expect(stringPtrArrayInstance.dataOffset).not.toBeNull();
      });

      test(".stringPtrArray should have the same length as the input array", () => {
        expect(stringPtrArrayInstance.stringPtrArray).toHaveLength(
          stringArray.length,
        );
      });

      test(`.stringPtrArray should not contain NULL_POINTER (${NULL_POINTER})`, () => {
        expect(stringPtrArrayInstance.stringPtrArray).not.toContain(
          NULL_POINTER,
        );
      });

      test(`.isNullTerminated should be ${isNullTerminated}`, () => {
        expect(stringPtrArrayInstance.isNullTerminated).toBe(isNullTerminated);
      });

      test(`.stringPtrArray should be ${stringArray} when converted to strings`, () => {
        expect(
          stringPtrArrayInstance.stringPtrArray.map((ptr) => UTF8ToString(ptr)),
        ).toEqual(stringArray);
      });

      test(".dataOffset should correspond to the pointer values of .stringPtrArray", () => {
        expect(
          Array.from({ length: stringArray.length }, (_, index) =>
            getValue(
              stringPtrArrayInstance.dataOffset! + index * POINTER_SIZE,
              "*",
            ),
          ),
        ).toEqual(stringPtrArrayInstance.stringPtrArray);
      });

      test(".byteLength should be the length of the array of pointers", () => {
        const getNumOfBytesUntilNullPointer = () => {
          let numOfBytes = 0;
          while (
            getValue(stringPtrArrayInstance.dataOffset! + numOfBytes, "*") !==
            NULL_POINTER
          ) {
            numOfBytes += POINTER_SIZE;
          }
          return numOfBytes;
        };

        expect(stringPtrArrayInstance.byteLength).toBe(
          !isNullTerminated ?
            stringArray.length * POINTER_SIZE
          : getNumOfBytesUntilNullPointer() + POINTER_SIZE,
        );
      });

      test(`last pointer in memory ${isNullTerminated ? "should" : "should not"} be NULL_POINTER (${NULL_POINTER})`, () => {
        expect(
          getValue(
            stringPtrArrayInstance.dataOffset! +
              stringPtrArrayInstance.byteLength -
              POINTER_SIZE,
            "*",
          ),
        ).toBe(
          isNullTerminated ? NULL_POINTER : (
            stringPtrArrayInstance.stringPtrArray.at(-1)
          ),
        );
      });
    },
  );
});
