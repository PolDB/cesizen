import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
reporter: [
  ['html'],
  ['playwright-qase-reporter', {
    testops: {
      api: { token: process.env.QASE_TOKEN },
      project: process.env.QASE_PROJECT,
      run: { complete: true },
      uploadAttachments: true,
    },
  }],
],
use: {
  baseURL: 'http://localhost:8081',
  trace: 'on-first-retry',
},
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});