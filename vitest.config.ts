import { defineConfig } from 'vitest/config';

import { libOxcConfig } from './packages/vite-config/src/shared/index.ts';

export default defineConfig({
  oxc: libOxcConfig,
  test: {
    include: ['packages/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx}'],
    exclude: ['packages/common/**', '**/node_modules/**', '**/{coverage,dist,esm}/**'],
    environment: 'node',
  },
});
