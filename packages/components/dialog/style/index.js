import { css, globalCSS } from 'omi';

import dialogStyles from './dialog.less';
import wcStyles from './wc.less';
// 为了做主题切换
import styles from '@common/style/web/components/dialog/_index.less';

export const styleSheet = css`
  ${styles}
  ${dialogStyles}
  ${wcStyles}
`;

globalCSS(styleSheet);
