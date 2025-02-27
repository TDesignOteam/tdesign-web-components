import { css, globalCSS } from 'omi';

// wc组件嵌套层级与公共样式有差距，单独维护样式表
import styles from './_index.less';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
