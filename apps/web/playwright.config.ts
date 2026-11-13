import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const CI = Boolean(process.env.CI);
/** Point at a deployed site instead, e.g. E2E_BASE_URL=https://umair-dev.vercel.app pnpm test:e2e */
const REMOTE = process.env.E2E_BASE_URL;

/**
 * Smoke tests against the production build: run `pnpm build` first, then
 * `pnpm test:e2e`. Locally an already-running server on PORT is reused.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: REMOTE ?? `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: REMOTE
    ? undefined
    : {
        command: `pnpm start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !CI,
        timeout: 120_000,
      },
});
