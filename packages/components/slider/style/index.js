import { css, globalCSS } from 'omi';

import wcStyles from './wc.less';
// 为了做主题切换
import styles from '@common/style/web/components/slider/_index.less';

export const styleSheet = css`
  ${styles}
  ${wcStyles}
`;

globalCSS(styleSheet);
