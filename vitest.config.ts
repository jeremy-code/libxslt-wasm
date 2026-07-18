import { defineConfig, configDefaults } from "vitest/config";

const vitestConfig = defineConfig({
  test: { include: configDefaults.include },
});

export default vitestConfig;
