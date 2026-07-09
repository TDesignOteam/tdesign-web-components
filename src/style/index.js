import { css, globalCSS } from 'omi';

import globalStye from '../_common/style/web/_global.less';
import theme from '../_common/style/web/theme/_index.less';
import chatSenderVars from '../chat-sender/style/_var.less';
import chatVars from '../chatbot/style/_var.less';
// Cherry Markdown 字体 - 需要在 Light DOM 中加载，解决 Shadow DOM 字体加载问题
import cherryIconFont from './cherry-icon-font.less';

const tdesignGlobalStyleId = 'tdesign-wc-global-style';

if (!document.getElementById(tdesignGlobalStyleId)) {
  const style = document.createElement('style');
  style.id = tdesignGlobalStyleId;
  style.innerHTML = `${theme}${cherryIconFont}`;
  document.head.appendChild(style);
}

export const styleSheet = css`
  ${globalStye}
  ${chatVars}
  ${chatSenderVars}
`;

globalCSS(styleSheet);
