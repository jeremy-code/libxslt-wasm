/** @import { Config } from "prettier" */

/**
 * @see {@link https://prettier.io/docs/en/configuration.html}
 * @satisfies {Config}
 */
const prettierConfig = {
  experimentalTernaries: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  trailingComma: "all",
  objectWrap: "collapse",
  proseWrap: "never",
};

export default prettierConfig;
