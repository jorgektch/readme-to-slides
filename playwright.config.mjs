import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '*.spec.mjs',
  timeout: 60000,
  use: {baseURL:'http://127.0.0.1:8765', browserName:'chromium', headless:true},
  reporter: [['list'], ['html',{open:'never'}]]
});
