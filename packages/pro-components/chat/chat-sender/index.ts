import './style/index.js';

import _ChatSender from './chat-sender';
import type {
  TdChatSenderAction,
  TdChatSenderActionName,
  TdChatSenderApi,
  TdChatSenderParams,
  TdChatSenderProps,
  TdChatSenderUploadProps,
  UploadActionType,
} from './type';

export type {
  TdChatSenderAction,
  TdChatSenderActionName,
  TdChatSenderApi,
  TdChatSenderParams,
  TdChatSenderProps,
  TdChatSenderUploadProps,
  UploadActionType,
};

export const ChatSender = _ChatSender;
export default ChatSender;
