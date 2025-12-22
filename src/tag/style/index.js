import { css, globalCSS } from 'omi';

import styles from '../../_common/style/web/components/tag/_index.less?inline';

export const styleSheet = css`
  ${styles}
`;

globalCSS(styleSheet);
