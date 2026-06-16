import { css, globalCSS } from 'omi';

import wcStyles from './wc.less';
import styles from '@common/style/web/components/collapse/_index.less';

export const styleSheet = css`
  ${styles}
  ${wcStyles}
`;

globalCSS(styleSheet);
