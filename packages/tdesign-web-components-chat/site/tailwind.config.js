/** @type {import('tailwindcss').Config} */
import { fileURLToPath } from 'node:url';
import { dirname } from 'path';

import { getWorkspaceRoot } from '../../../script/lib/get-root-path.mjs';
// 根 tailwind 配置作为 base 覆盖
import rootTailwindConfig from '../../../tailwind.config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = getWorkspaceRoot(__dirname);

export default {
  ...rootTailwindConfig,
  content: [
    './index.html',
    './**/*.{js,ts,jsx,tsx}',
    '!**/node_modules/**',
    `${ROOT}/packages/components/**/*.{js,ts,jsx,tsx}`,
    `!${ROOT}/packages/components/node_modules/**`,
    `${ROOT}/packages/pro-components/chat/**/*.{js,ts,jsx,tsx}`,
    `!${ROOT}/packages/pro-components/chat/node_modules/**`,
  ],
};
