import { css, globalCSS } from 'omi';

import backTopStyle from '../../_common/style/web/components/back-top/_index.less';
import theme from '../../_common/style/web/theme/_index.less';

export const styleSheet = css`
  ${backTopStyle} + ${theme}
`;

globalCSS(styleSheet);
