import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

// Gherkin specs live with the feature (feature-based org); generated tests
// go to .bddgen (gitignored). Specs and steps are in English.
const testDir = defineBddConfig({
  features: "features/**/specs/*.feature",
  steps: ["features/**/specs/steps.ts", "features/support/specs/bdd.ts"],
  outputDir: ".bddgen",
  language: "en",
});

// CI acceptance (gate 4, #13) points this at the real staging Service
// (in-cluster DNS) instead of a local server — same suite, real deploy.
// Local/private-build runs are unaffected: unset env, unchanged behavior.
const remoteBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir,
  timeout: 15_000,
  // Local acceptance changes the stub's operational feature-flag state.
  // One worker keeps those scenarios deterministic; staging never mutates
  // the real flag and can retain Playwright's normal parallelism.
  workers: remoteBaseURL ? undefined : 1,
  grepInvert: remoteBaseURL ? /@data/ : undefined,
  use: {
    baseURL: remoteBaseURL ?? "http://localhost:3100",
  },
  webServer: remoteBaseURL
    ? undefined
    : [
        {
          command: "STUB_BACKEND_PORT=3199 node features/prelecao/specs/stub-backend.mjs",
          url: "http://127.0.0.1:3199/healthz",
          reuseExistingServer: true,
          timeout: 30_000,
        },
        {
          command: "BACKEND_APP_URL=http://127.0.0.1:3199 npx next start -p 3100",
          url: "http://localhost:3100/mobile-only",
          reuseExistingServer: true,
          timeout: 30_000,
        },
      ],
});
