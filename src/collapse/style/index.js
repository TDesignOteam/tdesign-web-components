import { css, globalCSS } from 'omi';

import styles from '../../_common/style/web/components/collapse/_index.less?inline';
import wcStyles from './wc.less?inline';

export const styleSheet = css`
  ${styles}
  ${wcStyles}
`;

globalCSS(styleSheet);
