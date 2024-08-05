import { css, globalCSS } from 'omi';

import inputStyles from '../../_common/style/web/components/input/_index.less';
// 为了做主题切换
import styles from '../../_common/style/web/components/upload/_index.less';

export const styleSheet = css`
  ${inputStyles}
  ${styles}
`;

globalCSS(styleSheet);
