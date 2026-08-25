import { css, globalCSS } from 'omi';

import '../../style/variables.js';
import styles from './_index.less';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
