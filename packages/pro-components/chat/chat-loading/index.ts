import './style/index.js';

import _Loading from './loading';
import type { TdChatLoadingProps } from './type';

export * from './type';
export type ChatLoadingProps = TdChatLoadingProps;

export const ChatLoading = _Loading;
export default ChatLoading;
