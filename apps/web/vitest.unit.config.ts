import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const serverOnlyShim = fileURLToPath(new URL('./src/testing/server-only.ts', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      'server-only': serverOnlyShim,
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['src/**/*.component.test.{ts,tsx}'],
  },
});
