/**
 * Vitest configuration for frontend tests
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      exclude: [
        'node_modules/',
        'src/main.js',
      ],
    },
  },
});
