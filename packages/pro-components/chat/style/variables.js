import variables from './variables.less';

export const chatVariablesStyleId = 'tdesign-wc-chat-variables';

if (typeof document !== 'undefined' && !document.getElementById(chatVariablesStyleId)) {
  const style = document.createElement('style');
  style.id = chatVariablesStyleId;
  style.textContent = variables;
  document.head.appendChild(style);
}
