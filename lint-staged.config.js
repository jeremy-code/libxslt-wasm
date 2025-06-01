/** @import { Configuration } from "lint-staged" */

/**
 * @see {@link https://github.com/lint-staged/lint-staged#configuration}
 * @satisfies {Configuration}
 */
const lintStagedConfig = {
  "*.{js,ts}": ["pnpm run lint", "pnpm run format:check"],
  "*.{json,md,yaml,yml}": "pnpm run format",
};

export default lintStagedConfig;
