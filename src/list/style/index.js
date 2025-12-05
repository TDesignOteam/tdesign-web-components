import { css, globalCSS } from 'omi';

import listStyle from '../../_common/style/web/components/list/_index.less?inline';
import style from './wc.less?inline';

export const styleSheet = css`
  ${listStyle}
  ${style}
`;

globalCSS(styleSheet);
