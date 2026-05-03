/** @type {import('tailwindcss').Config} */
import { getWorkspaceRoot } from '../../script/lib/get-root-path.mjs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = getWorkspaceRoot(__dirname);

// 根 tailwind 配置作为 base 覆盖（静态 import 只能用相对路径，此处保留相对引用）
// 当 site 位于 playground/site/ 时需调整为 ../../tailwind.config
import rootTailwindConfig from '../../tailwind.config';

export default {
  ...rootTailwindConfig,
  content: ['./index.html', `${ROOT}/packages/*/src/**/*.{js,ts,jsx,tsx}`, './**/*.{js,ts,jsx,tsx}'],
};
