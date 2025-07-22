import './style/index.js';

import _Action from './action';

export const ChatAction = _Action;
export default ChatAction;

export * from './type.js';

// import './style/index.js';
// import { registerComponent } from '../_util/register';
// import ChatAction from './action';

// // 导出组件类
// export { ChatAction };

// // 注册函数
// const registerChatAction = () => {
//   if (!customElements.get('t-chat-action')) {
//     customElements.define('t-chat-action', ChatAction);
//   }
// };

// // 注册到中央系统
// registerComponent(
//   't-chat-action',
//   registerChatAction,
// );

// // 默认导出注册函数
// export default registerChatAction;

// export * from './type.js';
