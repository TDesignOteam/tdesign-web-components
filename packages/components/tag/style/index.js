import { css, globalCSS } from 'omi';

import styles from '@common/style/web/components/tag/_index.less';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
