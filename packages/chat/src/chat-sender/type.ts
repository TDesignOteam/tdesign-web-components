import { TNode } from '@tdesign/web-components-shared/common';
import { TdTextareaProps } from '@tdesign/web-components-ui/textarea';

import { TdAttachmentsProps } from '../attachments';
import { ChatRequestParams } from '../chat-engine';
import { TdAttachmentItem } from '../filecard';

export type TdChatSenderActionName = 'attachment' | 'send';

export interface TdChatSenderAction {
  name: string;
  render: TNode;
}

export interface TdChatSenderParams {
  value: string;
  attachments?: TdAttachmentItem[];
}

export interface TdChatSenderProps extends Pick<TdTextareaProps, 'autosize'> {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
  actions?: TdChatSenderActionName[] | ((preset: TdChatSenderAction[]) => TdChatSenderAction[]) | boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 透传attachment参数 */
  attachmentsProps?: TdAttachmentsProps;
  /** 透传textarea参数 */
  textareaProps?: Partial<Omit<TdTextareaProps, 'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'autosize'>>;
  /** 透传input-file参数 */
  uploadProps?: Omit<JSX.HTMLAttributes, 'onChange' | 'ref' | 'type' | 'hidden'>;
  /**
   * 覆盖发送条件，返回为true时标识为可发送
   * @default value不为空时可发送
   */
  readyToSend?: (inputValue: string) => boolean;
  onSend?: (e: CustomEvent<TdChatSenderParams>) => ChatRequestParams | void;
  onStop?: (e: CustomEvent<string>) => void;
  onChange?: (e: CustomEvent<string>) => void;
  onFileSelect?: (e: CustomEvent<TdAttachmentItem[]>) => void;
  onFileRemove?: (e: CustomEvent<TdAttachmentItem[]>) => void;
  onFocus?: (e: CustomEvent<string>) => void;
  onBlur?: (e: CustomEvent<string>) => void;
}

export interface TdChatSenderApi {
  /** 获取焦点 */
  focus: (opts?: FocusOptions) => void;
  /** 取消焦点 */
  blur: () => void;
}
