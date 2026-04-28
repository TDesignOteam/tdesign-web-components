import { css, globalCSS } from 'omi';

import wcStyles from './wc.less';
import avatarStyle from '@common/style/web/components/avatar/_index.less';

export const styleSheet = css`
  ${avatarStyle}
  ${wcStyles}
`;

globalCSS(styleSheet);
