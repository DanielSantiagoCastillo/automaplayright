import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  reporter: 'html',

  use: {
    headless: true,
    viewport: null,  // usamos tamaño de ventana real
    baseURL: 'https://demoqa.com/automation-practice-form',
    actionTimeout: 10_000,
    trace: 'on-first-retry',
    launchOptions: {
      args: ['--start-maximized'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});


