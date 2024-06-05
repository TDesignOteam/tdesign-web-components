import './tailwind.css';

import { css, globalCSS } from 'omi';

import tailwindStyle from './tailwind.css?inline';

export const tailwind = css`
  ${tailwindStyle}
`;

globalCSS(tailwind);
