import { css, globalCSS } from 'omi';

import styles from '../../_common/style/web/components/collapse/_index.less';
import wcStyles from './wc.less';

export const styleSheet = css`
  ${styles}
  ${wcStyles}
`;

globalCSS(styleSheet);
