import { css, globalCSS } from 'omi';
import styles from '../../_common/style/web/components/upload/_index.less';

// 为了做主题切换

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
