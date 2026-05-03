import { css, globalCSS } from 'omi';

// 为了做主题切换
import styles from '@common/style/web/components/loading/_index.less';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
