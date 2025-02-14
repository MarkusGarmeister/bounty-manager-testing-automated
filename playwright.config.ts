import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 40_000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter configuration */
  reporter: [
    ["line"],
    ["junit", { outputFile: "test-results/results.xml" }],
    [
      "playwright-xray",
      {
        jira: {
          url: "https://sqf.atlassian.net/",
          type: "cloud",
          apiVersion: "1.0",
        },
        cloud: {
          client_id: "A777E961919A4F20BADE10B31811909C",
          client_secret: "40fdb2f7f7d88f192a3ed9fc47ea4f0329829c65a2ecf428ec50c27ca8f47366",
          xrayUrl: 'https://eu.xray.cloud.getxray.app/'
        },
        projectKey: "BM",
        testPlan: "BM-93",
        debug: false,
        uploadScreenShot: true,
        uploadTrace: true,
        uploadVideo: true,
        summary: `[${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}] - Automated Test Run`,
        dryRun: false, 
      },
    ],
  ],

  /* Shared settings for all projects */
  use: {
    /* Collect trace when retrying the failed test */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"] }, // Korrigjim: Përdor Desktop Chrome
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
