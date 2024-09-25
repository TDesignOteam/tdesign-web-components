import { css, globalCSS } from 'omi';

// 为了做主题切换
import styles from '../../_common/style/web/components/dialog/_index.less';
import dialogStyles from './dialog.less';

export const styleSheet = css`
  ${styles}
  ${dialogStyles}
`;

globalCSS(styleSheet);
