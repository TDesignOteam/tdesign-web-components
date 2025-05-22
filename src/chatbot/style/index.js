import { css, globalCSS } from 'omi';

import styles from './_index.less';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
