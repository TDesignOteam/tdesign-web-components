import { css, globalCSS } from 'omi';

import styles from './_index.less?inline';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
