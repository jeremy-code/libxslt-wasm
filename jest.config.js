import { defaults } from "jest-config";
import { createDefaultEsmPreset } from "ts-jest";

/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
const jestConfig = {
  ...createDefaultEsmPreset({ tsconfig: "<rootDir>/tsconfig.test.json" }),
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
