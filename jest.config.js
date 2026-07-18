/** @import { JestConfigWithTsJest } from "ts-jest" */
import { createJsWithTsEsmPreset } from "ts-jest";

/**
 * @satisfies {JestConfigWithTsJest}
 */
const jestConfig = {
  ...createJsWithTsEsmPreset({ tsconfig: "<rootDir>/tsconfig.spec.json" }),
  injectGlobals: false,
  roots: ["<rootDir>/src/"],
};

export default jestConfig;
