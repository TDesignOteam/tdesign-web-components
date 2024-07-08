import { css, globalCSS } from 'omi';

import globalStye from  '../_common/style/web/_global.less';


export const styleSheet = css`
  ${globalStye}
`;

globalCSS(styleSheet);
