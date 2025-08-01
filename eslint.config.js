import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import eslint from "@eslint/js";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import pluginESx from "eslint-plugin-es-x";
import { importX, createNodeResolver } from "eslint-plugin-import-x";
import pluginJest from "eslint-plugin-jest";
import nodePlugin from "eslint-plugin-n";
import pluginPromise from "eslint-plugin-promise";
import { defaults } from "jest-config";
import tseslint from "typescript-eslint";

// [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]
const TEST_FILE_GLOBS = defaults.testMatch;

export default defineConfig(
  /**
   * Set global ignore patterns for build artifacts and git submodules
   *
   * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores}
   */
  globalIgnores(["dist/", "libxml2/", "libxslt/"]),
  /**
   * Add `name` property to "recommended" ESLint config, which doesn't exist for compatibility
   *
   * @see {@link https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js#L11-L17}
   */
  { name: "@eslint/js/recommended", ...eslint.configs.recommended },
  tseslint["configs"].recommended,
  importX["flatConfigs"].recommended,
  importX["flatConfigs"].typescript,
  nodePlugin.configs["flat/recommended-module"],
  comments.recommended,
  pluginPromise.configs["flat/recommended"],
  pluginESx.configs["flat/restrict-to-es2022"],
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { ecmaVersion: 2022 },
    rules: {
      /**
       * @see {@link https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/newline-after-import.md}
       */
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
      /**
       * @see {@link https://github.com/un-ts/eslint-plugin-import-x/tree/master/resolvers}
       */
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
      { name: "jest/style", ...pluginJest.configs["flat/style"] },
      {
        rules: {
          /**
           * @see {@link https://github.com/jest-community/eslint-plugin-jest/blob/HEAD/docs/rules/prefer-importing-jest-globals.md}
           */
          "jest/prefer-importing-jest-globals": "error",
        },
      },
    ],
  },
);
