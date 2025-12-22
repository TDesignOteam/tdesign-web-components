import { css, globalCSS } from 'omi';

import avatarStyle from '../../_common/style/web/components/avatar/_index.less?inline';
import wcStyles from './wc.less?inline';

export const styleSheet = css`
  ${avatarStyle}
  ${wcStyles}
`;

globalCSS(styleSheet);
