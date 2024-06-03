module.exports = {
  extends: [
    'airbnb-base',
    'prettier', // eslint-config-prettier 处理冲突
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': ['off', 2],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-interface': 'error', // codecc
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'error', // codecc
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          ['^(echarts)(/.*|$)'],
          // Internal packages.
          ['^(@|hooks|utils)(/.*|$)'],
          // Parent and other relative imports. Put `.` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.less$'],
        ],
      },
    ],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'max-len': 'off',
    'no-shadow': 'off',
    'no-console': 'off',
    'no-throw-literal': 'off',
    'no-unused-expressions': 'off',
    'no-bitwise': 'off',
    'no-useless-return': 'off',
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-continue': 'off',
    'no-return-assign': 'off',
    'no-restricted-syntax': 'off',
    'no-restricted-globals': 'off',
    'no-unneeded-ternary': 'off',
    'eol-last': 'error', // codecc
    'func-names': 'off',
    'consistent-return': 'off',
    'default-case': 'off',
    'object-curly-spacing': 'warn',
    'class-methods-use-this': 'off',
    'no-script-url': 'warn',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsForRegex: ['^html'] }],
    'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
  },
};
