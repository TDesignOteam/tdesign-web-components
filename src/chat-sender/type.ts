import { TdAttachmentsProps } from '../attachments';
import { TNode } from '../common';
import { TdAttachmentItem } from '../filecard';
import { TdTextareaProps } from '../textarea';

export interface TdChatSenderAction {
  name: string;
  render: TNode;
}

export interface TdChatSenderSend {
  value: string;
  attachments?: TdAttachmentItem[];
}

export interface TdChatSenderProps extends Pick<TdTextareaProps, 'autosize'> {
  placeholder?: string;
  disabled?: boolean;
  value: string;
  defaultValue: string;
  actions?: TdChatSenderAction[] | ((preset: TdChatSenderAction[]) => TdChatSenderAction[]) | boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 透传attachment参数 */
  attachmentsProps?: TdAttachmentsProps;
  /** 透传textarea参数 */
  textareaProps?: Partial<Omit<TdTextareaProps, 'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'autosize'>>;
  /** 透传input-file参数 */
  uploadProps?: Omit<JSX.HTMLAttributes, 'onChange' | 'ref' | 'type' | 'hidden'>;
  onSend?: (e: CustomEvent<TdChatSenderSend>) => void;
  onStop?: (e: CustomEvent<string>) => void;
  onChange?: (e: CustomEvent<string>) => void;
  onFileSelect?: (e: CustomEvent<File[]>) => Promise<TdAttachmentItem[]>;
  onFileRemove?: (e: CustomEvent<File[]>) => Promise<TdAttachmentItem[]>;
}
