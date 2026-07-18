import { fileURLToPath } from "node:url";

import eslint from "@eslint/js";
import * as comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import vitest from "@vitest/eslint-plugin";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import pluginESx from "eslint-plugin-es-x";
import { importX, createNodeResolver } from "eslint-plugin-import-x";
import nodePlugin from "eslint-plugin-n";
import pluginPromise from "eslint-plugin-promise";
import * as tseslint from "typescript-eslint";
import { configDefaults } from "vitest/config";

// ["**/*.{test,spec}.?(c|m)[jt]s?(x)"]
const TEST_FILE_GLOBS = configDefaults.include;

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig(
  includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
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
    extends: [vitest.configs.recommended],
    rules: {
      /**
       * @see {@link https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-importing-vitest-globals.md}
       */
      "vitest/prefer-importing-vitest-globals": "error",
    },
  },
);
