import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      {
        plugins: [tsconfigPaths()],
        test: {
          name: "unit",
          globals: true,
          environment: "node",
          include: ["src/modules/**/useCases/__tests__/unit/**/*.test.ts"],
        },
      },
      {
        plugins: [tsconfigPaths()],
        test: {
          name: "integration",
          globals: true,
          environment: "node",
          include: [
            "src/modules/**/useCases/__tests__/integration/**/*.integration.test.ts",
          ],
          testTimeout: 15000,
          hookTimeout: 15000,
          pool: "forks",
          fileParallelism: false,
          globalSetup: "src/shared/testing/globalSetup.ts",
          env: {
            JWT_SECRET: "test-secret-key-for-integration-tests",
          },
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/modules/**/useCases/**/*.ts"],
      exclude: ["src/modules/**/__tests__/**"],
    },
  },
});
