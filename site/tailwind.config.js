/** @type {import('tailwindcss').Config} */
import tailwindConfig from '../tailwind.config';

export default {
  ...tailwindConfig,
  content: ['./index.html', '../src/**/*.{js,ts,jsx,tsx}', '**/*.{js,ts,jsx,tsx}'],
};
