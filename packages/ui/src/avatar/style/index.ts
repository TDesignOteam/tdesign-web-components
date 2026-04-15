import { css, globalCSS } from 'omi';

import avatarStyle from '../../_common/style/web/components/avatar/_index.less';
import wcStyles from './wc.less';

export const styleSheet = css`
  ${avatarStyle}
  ${wcStyles}
`;

globalCSS(styleSheet);
