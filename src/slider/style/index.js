import { css, globalCSS } from 'omi';

// 为了做主题切换
import styles from '../../_common/style/web/components/slider/_index.less?inline';
import wcStyles from './wc.less?inline';

export const styleSheet = css`
  ${styles}
  ${wcStyles}
`;

globalCSS(styleSheet);
