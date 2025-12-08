import { css, globalCSS } from 'omi';

import styles from '../../_common/style/web/components/date-picker/_index.less';
import baseStyles from './index.less'

export const styleSheet = css`
  ${styles}
  ${baseStyles}
`;

globalCSS(styleSheet);
