import { css, globalCSS } from 'omi';

import avatarStyle from '../../_common/style/web/components/avatar/_index.less';
import theme from '../../_common/style/web/theme/_index.less';

export const styleSheet = css`
  ${avatarStyle} + ${theme}
`;

globalCSS(styleSheet);
