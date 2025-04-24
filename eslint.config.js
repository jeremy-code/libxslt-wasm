import eslint from "@eslint/js";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import pluginImportX, { createNodeResolver } from "eslint-plugin-import-x";
import pluginJest from "eslint-plugin-jest";
import { defaults } from "jest-config";
import tseslint from "typescript-eslint";

// [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]
const TEST_FILE_GLOBS = defaults.testMatch;

export default tseslint.config(
  { ignores: ["dist/", "libxml2/", "libxslt/"] },
  /**
   * Add `name` property to "recommended" ESLint config, which doesn't exist for compatibility
   *
   * @see {@link https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js#L11}
   */
  { name: "@eslint/js/recommended", ...eslint.configs.recommended },
  tseslint["configs"].recommended,
  pluginImportX["flatConfigs"].recommended,
  pluginImportX["flatConfigs"].typescript,
  {
    rules: {
      "import-x/newline-after-import": ["error", { considerComments: true }],
      /**
       * @see {@link https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md}
       */
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", ["parent", "sibling", "index"]],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
    },
    settings: {
      "import/resolver-next": [
        createTypeScriptImportResolver(),
        createNodeResolver(),
      ],
    },
  },
  {
    files: TEST_FILE_GLOBS,
    extends: [
      { name: "jest/recommended", ...pluginJest.configs["flat/recommended"] },
      {
        rules: {
          // https://github.com/jest-community/eslint-plugin-jest/blob/HEAD/docs/rules/prefer-importing-jest-globals.md
          "jest/prefer-importing-jest-globals": "error",
        },
      },
    ],
  },
  {
    extends: [tseslint["configs"].disableTypeChecked],
    files: ["**/*.{js,cjs,jsx,mjs}"],
  },
);
