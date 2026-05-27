import { css, globalCSS } from 'omi';

// 为了做主题切换
import styles from '../../_common/style/web/components/dialog/_index.less?inline';
import dialogStyles from './dialog.less?inline';
import wcStyles from './wc.less?inline';

export const styleSheet = css`
  ${styles}
  ${dialogStyles}
  ${wcStyles}
`;

globalCSS(styleSheet);
