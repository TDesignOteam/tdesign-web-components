import { css, globalCSS } from 'omi';

import style from './wc.less';
import listStyle from '@common/style/web/components/list/_index.less';

export const styleSheet = css`
  ${listStyle}
  ${style}
`;

globalCSS(styleSheet);
