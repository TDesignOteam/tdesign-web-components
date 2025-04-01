import './style/index.js';

import reactifyWebComponent from 'omi-reactify';

import _ChatItem from './ui/chat-item';
import _Chat from './chat';

export const Chat = _Chat;
export const ChatItem = _ChatItem;

export * from './core';
export * from './type';

const ChatBot = reactifyWebComponent('t-chatbot');

export { ChatBot };
export default Chat;
