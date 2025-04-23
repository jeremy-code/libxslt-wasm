import eslint from "@eslint/js";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import pluginImportX, { createNodeResolver } from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

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
    extends: [tseslint["configs"].disableTypeChecked],
    files: ["**/*.{js,cjs,jsx,mjs}"],
  },
);
