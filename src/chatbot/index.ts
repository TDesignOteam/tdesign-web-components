import './style/index.js';

import React from 'react';
import reactifyWebComponent from 'omi-reactify';

import _ChatItem from './ui/chat-item';
import _Chat from './chat';
import { TdChatProps } from './type';

export const Chat = _Chat;
export const ChatItem = _ChatItem;

export * from './core';
export * from './type';

const ChatBot: React.ForwardRefExoticComponent<
  Omit<TdChatProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactifyWebComponent<TdChatProps>('t-chatbot');
export { ChatBot };
export default Chat;
