import { TdAttachmentsProps } from '../attachments';
import { ChatRequestParams } from '../chatbot';
import { TNode } from '../common';
import { TdAttachmentItem } from '../filecard';
import { TdTextareaProps } from '../textarea';

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
