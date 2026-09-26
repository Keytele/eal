import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.component.test.{ts,tsx}'],
  },
});
