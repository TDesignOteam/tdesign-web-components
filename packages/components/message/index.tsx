import './style/index.js';

import _Message, { MessagePlugin as _MessagePlugin } from './message';
import type {
  MessageCloseAllMethod,
  MessageConfigMethod,
  MessageContainerProps,
  MessageErrorMethod,
  MessageInfoMethod,
  MessageInfoOptions,
  MessageInstance,
  MessageLoadingMethod,
  MessageMethod,
  MessageOptions,
  MessagePlacementList,
  MessagePluginType,
  MessageQuestionMethod,
  MessageSuccessMethod,
  MessageThemeList,
  MessageWarningMethod,
} from './type';

export type { MessageProps } from './messageComponent';
export type {
  MessageCloseAllMethod,
  MessageConfigMethod,
  MessageContainerProps,
  MessageErrorMethod,
  MessageInfoMethod,
  MessageInfoOptions,
  MessageInstance,
  MessageLoadingMethod,
  MessageMethod,
  MessageOptions,
  MessagePlacementList,
  MessagePluginType,
  MessageQuestionMethod,
  MessageSuccessMethod,
  MessageThemeList,
  MessageWarningMethod,
};
export const Message = _Message;
export const message = _MessagePlugin;
export const MessagePlugin = _MessagePlugin;

export default Message;
