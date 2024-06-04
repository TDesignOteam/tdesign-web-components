import './tailwind.css';
import '../assets/icon-font.css';

import { css, globalCSS } from 'omi';

import icon from '../assets/icon-font.css?inline';
import tailwindStyle from './tailwind.css?inline';

export const tailwind = css`
  ${tailwindStyle}
  ${icon}
`;

globalCSS(tailwind);
