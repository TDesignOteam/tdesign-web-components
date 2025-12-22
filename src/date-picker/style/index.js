import { css, globalCSS } from 'omi';

import styles from '../../_common/style/web/components/date-picker/_index.less?inline';
import baseStyles from './index.less?inline';

export const styleSheet = css`
  ${styles}
  ${baseStyles}
`;

globalCSS(styleSheet);
