import { css, globalCSS } from 'omi';

import styles from './_index.less';
import cherryIconFont from './cherry-icon-font.less';

// Cherry Markdown 字体 - 需要在 Light DOM 中加载，解决 Shadow DOM 字体加载问题
const cherryIconFontStyleId = 'tdesign-wc-cherry-icon-font';

if (typeof document !== 'undefined' && !document.getElementById(cherryIconFontStyleId)) {
  const style = document.createElement('style');
  style.id = cherryIconFontStyleId;
  style.innerHTML = cherryIconFont;
  document.head.appendChild(style);
}

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
