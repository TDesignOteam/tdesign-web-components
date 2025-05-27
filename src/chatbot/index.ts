import './style/index.js';

import _Chat from './chat';

export const Chat = _Chat;

export * from './core';
export * from './type';

// 为方便如影测试，暂时从这里导出react组件
// import reactifyWebComponent from 'omi-reactify';
// import { TdChatProps } from './type';
// const ChatBot = reactifyWebComponent<TdChatProps>('t-chatbot');
// export { ChatBot };
export default Chat;
