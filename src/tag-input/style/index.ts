import { css, globalCSS } from 'omi';

import inputStyles from '../../_common/style/web/components/input/_index.less';
import tagStyles from '../../_common/style/web/components/tag/_index.less';
import styles from '../../_common/style/web/components/tag-input/_index.less';
import theme from '../../_common/style/web/theme/_index.less';

export const styleSheet = css`
  ${styles}
  ${inputStyles}
  ${tagStyles}
  ${theme}
`;

globalCSS(styleSheet);
