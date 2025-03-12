import './ui/chat-list';
import './ui/chat-input';
import '../button';

import { Component, createRef, OmiProps, signal,tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { Attachment } from '../filecard';
import type { AttachmentContent, ChatStatus, Message, MessageState } from './core/type';
import ChatService from './core';
import type { TdChatInputSend, TdChatListProps, TdChatProps } from './type';

import styles from './style/chat.less';

const className = `${getClassPrefix()}-chat`;
@tag('t-chatbot')
export default class Chatbot extends Component<TdChatProps> {
  static css = [styles];

  static defaultProps = {
    clearHistory: false,
    layout: 'both',
    reverse: false,
    data: [],
  };

  static propTypes = {
    clearHistory: Boolean,
    layout: String,
    data: Array,
    reverse: Boolean,
    modelConfig: Object,
    attachmentProps: Object,
  };

  listRef = createRef<TdChatListProps>();

  private messages: Message[];

  private chatStatus: ChatStatus;

  private chatService: ChatService;

  private uploadedAttachments: AttachmentContent[] = [];

  private unsubscribeMsg?: () => void;

  private files = signal<Attachment[]>([]);

  provide = {
    messageStore: {},
    modelStore: {},
  };

  install(): void {
    const { data } = this.props;
    const initialMessages = data.map(({ message }) => message);
    this.chatService = new ChatService(this.props.modelConfig, initialMessages);
    const { messageStore } = this.chatService;
    this.provide.messageStore = messageStore;
    this.chatStatus = messageStore.currentMessage.status;
    this.messages = this.convertMessages(messageStore.getState());
    this.subscribeToChat();
  }

  uninstall() {
    this.unsubscribeMsg?.();
  }

  // 订阅聊天状态变化
  private subscribeToChat() {
    this.unsubscribeMsg = this.chatService.messageStore.subscribe(
      (state) => {
        this.messages = this.convertMessages(state);
        this.chatStatus = this.messages.at(-1)?.status;
        this.update();
      },
      // ['messageIds'],
    );
  }

  // 转换消息格式到UI所需格式
  private convertMessages(state: MessageState) {
    return state.messageIds.map((id) => {
      const msg = state.messages[id];
      return { ...msg };
    });
  }

  private handleSend = async (e: CustomEvent<TdChatInputSend>) => {
    const { value } = e.detail;
    await this.chatService.sendMessage(value, this.uploadedAttachments);
    this.fire('submit', value, {
      composed: true,
    });
    // this.listRef.current?.scrollToBottom();
  };

  private handleStop = () => {
    this.chatService.abortChat();
    this.fire('stop');
  };

  private handleClear = (e: Event) => {
    this.fire('clear', e);
  };

  private onAttachmentsRemove = (e: CustomEvent<Attachment[]>) => {
    console.log('onAttachmentsRemove', e);
    this.files.value = e.detail;
  };

  private onAttachmentsSelect = async (e: CustomEvent<Attachment[]>) => {
    const uploadedAttachments = await this.props?.attachmentProps?.onFileSelected?.(e.detail);
    if (uploadedAttachments.length > 0) {
      this.uploadedAttachments = uploadedAttachments;
    }
    this.files.value = this.files.value.concat(e.detail);
  };

  render({ layout, clearHistory, reverse }: OmiProps<TdChatProps>) {
    const layoutClass = layout === 'both' ? `${className}-layout-both` : `${className}-layout-single`;
    console.log('====render chat', this.messages);
    return (
      <div className={`${className} ${layoutClass}`}>
        <t-chat-list ref={this.listRef} data={this.messages} reverse={reverse} />
        {clearHistory && (
          <div className={`${className}-clear`}>
            <t-button type="text" onClick={this.handleClear}>
              清空历史记录
            </t-button>
          </div>
        )}
        <t-chat-input
          actions
          autosize={{ minRows: 2 }}
          onSend={this.handleSend}
          status={this.chatStatus}
          onStop={this.handleStop}
          attachments={this.files.value}
          onAttachmentsSelect={this.onAttachmentsSelect}
          onAttachmentsRemove={this.onAttachmentsRemove}
        />
      </div>
    );
  }
}
