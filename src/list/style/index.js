import { css, globalCSS } from 'omi';

import listStyle from '../../_common/style/web/components/list/_index.less';
import style from './wc.less';

export const styleSheet = css`
  ${listStyle}
  ${style}
`;

globalCSS(styleSheet);
