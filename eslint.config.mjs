import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** 需要 lint 的源码目录（UI / Chat 组件 + 文档站） */
const lintFiles = [
  'packages/components/**/*.{js,ts,tsx}',
  'packages/pro-components/chat/**/*.{js,ts,tsx}',
  'packages/shared/src/**/*.{js,ts,tsx}',
  'packages/tdesign-web-components/site/**/*.{js,ts,tsx}',
  'packages/tdesign-web-components-chat/site/**/*.{js,ts,tsx}',
];

/** @type {import('eslint').Linter.RulesRecord} */
const customRules = {
  'no-use-before-define': 'off',
  'no-useless-constructor': 'off',
  'no-param-reassign': 'off',
  '@typescript-eslint/no-useless-constructor': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-empty-interface': 'error',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-require-imports': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-unsafe-function-type': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-useless-assignment': 'off',
  'no-constant-binary-expression': 'off',
  'no-useless-assignment': 'off',
  '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
  '@typescript-eslint/no-unused-vars': 'error',
  'simple-import-sort/imports': [
    'error',
    {
      groups: [
        ['^\\u0000'],
        ['^react', '^@?\\w'],
        ['^(echarts)(/.*|$)'],
        ['^(@|hooks|utils)(/.*|$)'],
        ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ['^.+\\.less$'],
      ],
    },
  ],
  'simple-import-sort/exports': 'error',
  'max-len': 'off',
  'no-shadow': 'off',
  'no-console': 'off',
  'no-bitwise': 'off',
  'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  'no-continue': 'off',
  'no-return-assign': 'off',
  'no-restricted-syntax': 'off',
  'no-restricted-globals': 'off',
  'eol-last': 'error',
  'func-names': 'off',
  'consistent-return': 'off',
  'default-case': 'off',
  'object-curly-spacing': 'off',
  'no-script-url': 'warn',
  'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname', '__TDESIGN_THEME_PREFIX__'] }],
  'no-restricted-imports': [
    'error',
    {
      paths: [{ name: 'lodash', message: 'Please use lodash-es instead.' }],
    },
  ],
};

export default defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/lib/**',
      '**/esm/**',
      '**/cjs/**',
      '**/es/**',
      '**/node_modules/**',
      'common-utils/**',
      'server/**',
      'packages/vite-config/**',
      '**/public/**',
      'postcss.config.cjs',
      'tailwind.config.js',
      'packages/**/tailwind.config.js',
    ],
  },
  {
    files: lintFiles,
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: customRules,
  },
  {
    files: ['packages/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'lodash', message: 'Please use lodash-es instead.' }],
          patterns: ['@tdesign/web-components/*'],
        },
      ],
    },
  },
  {
    files: ['packages/pro-components/chat/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'lodash', message: 'Please use lodash-es instead.' }],
          patterns: ['@tdesign/web-components-chat/*'],
        },
      ],
    },
  },
  {
    files: [
      'packages/components/**/_example/**/*.{ts,tsx}',
      'packages/pro-components/chat/**/_example/**/*.{ts,tsx}',
      'packages/tdesign-web-components/site/**/*.{ts,tsx}',
      'packages/tdesign-web-components-chat/site/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
