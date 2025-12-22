import { css, globalCSS } from 'omi';

// 为了做主题切换
import styles from '../../_common/style/web/components/skeleton/_index.less?inline';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
