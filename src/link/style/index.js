import { css, globalCSS } from 'omi';

import linkStyle from '../../_common/style/web/components/link/_index.less?inline';

export const styleSheet = css`
  ${linkStyle}
`;

globalCSS(styleSheet);
