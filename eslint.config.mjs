import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      ".bddgen/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  {
    // Playwright/Gherkin step definitions, not React components — the
    // fixture parameter named `use` reads as a hook name to the plugin.
    files: ["**/specs/**"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      // Step callbacks take positional params some scenarios don't need
      // (Cucumber-style {string} capture groups) — leading underscore is
      // the deliberate "unused on purpose" signal.
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

export default config;
