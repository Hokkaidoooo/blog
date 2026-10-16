import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';

const reportDirectory = resolve(process.env.BLOG_QA_DIR ?? 'test-results/site');

export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  expect: { timeout: 10000 },
  workers: 1,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: resolve(reportDirectory, 'browser-results.json') }]],
  outputDir: 'test-results/browser',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    viewport: { width: 1440, height: 960 },
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
