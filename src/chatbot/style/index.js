import { css, globalCSS } from 'omi';

import styles from './_index.less';
// wc组件嵌套层级与公共样式有差距，单独维护样式表
import vars from './_var.less';

export const styleSheet = css`
  ${styles}
`;
export const varSheet = css`
  ${vars}
`;

globalCSS(styleSheet);
globalCSS(varSheet);
