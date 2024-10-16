import { css, globalCSS } from 'omi';

import globalStye from '../_common/style/web/_global.less';
import popupStyle from '../_common/style/web/components/popup/_index.less';
import theme from '../_common/style/web/theme/_index.less';

const tdesignGlobalStyleId = 'tdesign-wc-global-style';

if (!document.getElementById(tdesignGlobalStyleId)) {
  const style = document.createElement('style');
  style.id = tdesignGlobalStyleId;
  style.innerHTML = `${theme}${popupStyle}`;
  document.head.appendChild(style);
}

export const styleSheet = css`
  ${globalStye}
`;

globalCSS(styleSheet);
