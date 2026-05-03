import { css, globalCSS } from 'omi';

// 为了做主题切换
import styles from '@common/style/web/components/dropdown/_index.less';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
