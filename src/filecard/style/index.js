import { css, globalCSS } from 'omi';

// 为了做主题切换
// import styles from '../../_common/style/web/components/button/_index.less';
import styles from './filecard.less';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
