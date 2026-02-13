import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@test': path.resolve(__dirname, 'test'),
    },
  },

  esbuild: {
    // 配置omi的jsx转换
    jsxFactory: 'h',
    jsxFragment: 'h.f',
    jsxInject: `import { h } from 'omi'`,
  },

  test: {
    globals: true,
    environment: 'happy-dom',
    testTimeout: 16000,
    include: ['src/**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      'lib',
      'esm',
      'cjs',
      '_site',
      'site',
      'src/_common/**',
      '**/*.d.ts',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
