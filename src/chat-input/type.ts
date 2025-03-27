import { TdAttachmentsProps } from '../attachments';
import { ChatStatus } from '../chatbot/core/type';
import { TNode } from '../common';
import { Attachment } from '../filecard';
import { TdTextareaProps } from '../textarea';

export interface TdChatInputAction {
  name: string;
  render: TNode;
}

export interface TdChatInputSend {
  value: string;
  attachments?: Attachment[];
}

export interface TdChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  value: string | number;
  defaultValue: string | number;
  actions?: TdChatInputAction[] | ((preset: TdChatInputAction[]) => TdChatInputAction[]) | boolean;
  /** 生成状态 */
  status?: ChatStatus;
  /** 生成时是否允许停止 */
  allowStop?: boolean;
  /** 透传attachment参数 */
  attachmentsProps?: TdAttachmentsProps;
  /** 透传textarea参数 */
  textareaProps?: Partial<Omit<TdTextareaProps, 'value' | 'defaultValue' | 'placeholder' | 'disabled'>>;
  /** 透传input-file参数 */
  uploadProps?: Omit<JSX.HTMLAttributes, 'onChange' | 'ref' | 'type' | 'hidden'>;
  onSend?: (e: CustomEvent<TdChatInputSend>) => void;
  onStop?: (value: string, context: { e: MouseEvent }) => void;
  onChange?: (value: string, context: { e: InputEvent | MouseEvent | KeyboardEvent }) => void;
  onBlur?: (value: string, context: { e: FocusEvent }) => void;
  onFocus?: (value: string, context: { e: FocusEvent }) => void;
  onFileSelect?: (files: File[]) => Promise<Attachment[]>;
  onFileRemove?: (files: File[]) => Promise<Attachment[]>;
}
