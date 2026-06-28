import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
reporter: [
  ['html'],
],
use: {
  baseURL: 'http://localhost:8081',
  trace: 'on-first-retry',
  video: 'on',

},
  projects: [
    {
      name: 'chromium',
      use: {
         ...devices['Desktop Chrome'],
        launchOptions: {
          slowMo: 500,
        },
       },
    },
  ],
});