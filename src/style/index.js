import { css, globalCSS } from 'omi';

import '../_common/style/web/theme/_index.less';
import globalStye from  '../_common/style/web/_global.less';


export const styleSheet = css`
  ${globalStye}
`;

globalCSS(styleSheet);
