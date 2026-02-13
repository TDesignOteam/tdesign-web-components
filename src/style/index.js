import { css, globalCSS } from 'omi';

import globalStye from '../_common/style/web/_global.less?inline';
import popupStyle from '../_common/style/web/components/popup/_index.less?inline';
import theme from '../_common/style/web/theme/_index.less?inline';
import chatSenderVars from '../chat-sender/style/_var.less?inline';
import chatVars from '../chatbot/style/_var.less?inline';

const tdesignGlobalStyleId = 'tdesign-wc-global-style';

if (!document.getElementById(tdesignGlobalStyleId)) {
  const style = document.createElement('style');
  style.id = tdesignGlobalStyleId;
  style.innerHTML = `${theme}${popupStyle}${chatVars}${chatSenderVars}`;
  document.head.appendChild(style);
}

export const styleSheet = css`
  ${globalStye}
  ${chatVars}
  ${chatSenderVars}
`;

globalCSS(styleSheet);
