import './style/index.js';

import reactifyWebComponent from 'omi-reactify';

import _Chat from './chat';
import { TdChatProps } from './type';

export const Chat = _Chat;

export * from './core';
export * from './type';

// 为方便如影测试，暂时从这里导出react组件
const ChatBot = reactifyWebComponent<TdChatProps>('t-chatbot');
export { ChatBot };
export default Chat;
