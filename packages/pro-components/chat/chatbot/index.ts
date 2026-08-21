import './style/index.js';

import _Chat from './chat';
import type {
  BackBottomParams,
  FetchSSEOptions,
  Layout,
  MetaData,
  ModelRoleEnum,
  ScrollPosition,
  SSEEvent,
  TdChatbotApi,
  TdChatCodeProps,
  TdChatInjectCSS,
  TdChatListApi,
  TdChatListProps,
  TdChatListScrollToOptions,
  TdChatMessageActionEvent,
  TdChatMessageConfig,
  TdChatMessageConfigItem,
  TdChatProps,
} from './type';

export type {
  BackBottomParams,
  FetchSSEOptions,
  Layout,
  MetaData,
  ModelRoleEnum,
  ScrollPosition,
  SSEEvent,
  TdChatbotApi,
  TdChatCodeProps,
  TdChatInjectCSS,
  TdChatListApi,
  TdChatListProps,
  TdChatListScrollToOptions,
  TdChatMessageActionEvent,
  TdChatMessageConfig,
  TdChatMessageConfigItem,
  TdChatProps,
};

export const Chat = _Chat;
export default Chat;
