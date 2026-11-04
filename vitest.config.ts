import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    // .bddgen holds Playwright specs generated from the Gherkin features —
    // they belong to `playwright test`, never to vitest.
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "features/feature-flags/**/*.ts",
        "features/landing/**/*.ts",
        "features/landing/**/*.tsx",
        "features/prelecao/**/*.ts",
        "features/prelecao/**/*.tsx",
        "features/sobre-nos/team-repository.ts",
        "shared/backend.ts",
        "shared/feature-flag-contract.ts",
        "shared/feature-flag-override.ts",
        "middleware.ts",
        "shared/device.ts",
        "shared/footer-nav.tsx",
        "shared/logo.tsx",
        "shared/match-icons.tsx",
        "shared/social-links.tsx",
      ],
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/specs/**",
      ],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    exclude: ["**/node_modules/**", "**/.bddgen/**", "**/.next/**"],
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
