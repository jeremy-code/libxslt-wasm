/** @import { JestConfigWithTsJest } from "ts-jest" */
import { defaults } from "jest-config";
import { createJsWithTsEsmPreset } from "ts-jest";

/**
 * @satisfies {JestConfigWithTsJest}
 */
const jestConfig = {
  ...createJsWithTsEsmPreset({ tsconfig: "<rootDir>/tsconfig.spec.json" }),
  injectGlobals: false,
  roots: ["<rootDir>/src/"],
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    "<rootDir>/dist/",
    "<rootDir>/libxml2/",
    "<rootDir>/libxslt/",
  ],
};

export default jestConfig;
