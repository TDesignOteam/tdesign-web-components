import { css, globalCSS } from 'omi';

import globalStye from  '../_common/style/web/_global.less';
import themeStyle from '../_common/style/web/theme/_index.less';


export const styleSheet = css`
  ${globalStye}
  ${themeStyle}
`;

globalCSS(styleSheet);
