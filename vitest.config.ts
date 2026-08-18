import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx}'],
    exclude: ['packages/common/**', '**/node_modules/**', '**/{coverage,dist,esm}/**'],
    environment: 'node',
  },
});
