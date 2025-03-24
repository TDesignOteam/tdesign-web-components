import './ui/chat-list';
import '../chat-input';
import '../button';

import { Component, createRef, OmiProps, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { TdChatInputSend } from '../chat-input';
import { Attachment } from '../filecard';
import type { AttachmentItem, AttachmentType, ChatStatus, Message } from './core/type';
import ChatService from './core';
import type { TdChatListProps, TdChatProps, TdChatRolesConfig } from './type';

import styles from './style/chat.less';

const className = `${getClassPrefix()}-chat`;
@tag('t-chatbot')
export default class Chatbot extends Component<TdChatProps> {
  static css = [styles];

  static propTypes = {
    clearHistory: Boolean,
    layout: String,
    items: Array,
    reverse: Boolean,
    modelConfig: Object,
    rolesConfig: Object,
    attachmentProps: Object,
  };

  static defaultProps = {
    clearHistory: false,
    layout: 'both',
    reverse: false,
    items: [],
  };

  listRef = createRef<TdChatListProps>();

  private messages: Message[] = [];

  private chatStatus: ChatStatus = 'idle';

  private chatEngine: ChatService;

  private uploadedAttachments: AttachmentItem[] = [];

  private unsubscribeMsg?: () => void;

  private files = signal<Attachment[]>([]);

  provide = {
    messageStore: {},
    chatEngine: null,
  };

  ready(): void {
    this.initChat();
    this.update();
  }

  private initChat() {
    const { items, rolesConfig } = this.props;
    this.rolesConfig = {
      ...this.presetRoleConfig,
      ...rolesConfig,
    };
    const initialMessages = items.map(({ message }) => message);
    this.chatEngine = new ChatService(this.props.modelConfig, initialMessages);
    const { messageStore } = this.chatEngine;
    this.provide.messageStore = messageStore;
    this.provide.chatEngine = this.chatEngine;
    if (messageStore.currentMessage) {
      this.chatStatus = messageStore.currentMessage.status;
    }
    this.messages = messageStore.getState().messages;
    this.subscribeToChat();
  }

  uninstall() {
    this.unsubscribeMsg?.();
  }

  // 订阅聊天状态变化
  private subscribeToChat() {
    this.unsubscribeMsg = this.chatEngine.messageStore.subscribe(
      (state) => {
        this.messages = state.messages;
        this.chatStatus = this.messages.at(-1)?.status;
        this.update();
      },
      // ['messageIds'],
    );
  }

  private presetRoleConfig: TdChatRolesConfig = {
    user: {
      variant: 'text',
      placement: 'right',
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    assistant: {
      variant: 'text',
      placement: 'left',
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      actions: (preset) => preset,
    },
    error: {},
    system: {},
    'model-change': {},
  };

  rolesConfig = this.presetRoleConfig;

  private handleSend = async (e: CustomEvent<TdChatInputSend>) => {
    const { value } = e.detail;
    await this.chatEngine.sendMessage(value, this.uploadedAttachments);
    this.uploadedAttachments = [];
    this.files.value = [];
    this.fire('submit', value, {
      composed: true,
    });
    // this.listRef.current?.scrollToBottom();
  };

  private handleStop = () => {
    this.chatEngine.abortChat();
    this.fire('stop');
  };

  private handleClear = (e: Event) => {
    this.fire('clear', e);
  };

  private onAttachmentsRemove = (e: CustomEvent<File[]>) => {
    console.log('onAttachmentsRemove', e);
    this.files.value = e.detail;
  };

  private onAttachmentsSelect = async (e: CustomEvent<File[]>) => {
    const uploadedResult = await this.props?.attachmentProps?.onFileSelected?.(e.detail);
    if (uploadedResult.length > 0) {
      // 使用不可变方式更新数组
      const newAttachments = uploadedResult.map(({ name, url, type, size }) => ({
        name,
        url,
        fileType: type as AttachmentType,
        size,
        isReference: false,
      }));

      // 使用扩展运算符创建新数组
      this.uploadedAttachments = [...this.uploadedAttachments, ...newAttachments];
      this.files.value = this.files.value.concat(uploadedResult);
    }
  };

  private renderItems = () => {
    const items = this.props.reverse ? [...this.messages].reverse() : this.messages;
    return items.map((item) => {
      const { role, id } = item;
      return <t-chat-item {...this.rolesConfig?.[role]} message={item} key={id} />;
    });
  };

  render({ layout, clearHistory, reverse }: OmiProps<TdChatProps>) {
    const layoutClass = layout === 'both' ? `${className}-layout-both` : `${className}-layout-single`;
    console.log('====render chat', this.messages);
    return (
      <div className={`${className} ${layoutClass}`}>
        {this.messages && (
          <t-chat-list ref={this.listRef} messages={this.messages} reverse={reverse}>
            {this.renderItems()}
          </t-chat-list>
        )}
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
        >
          <slot name="input-header" slot="header"></slot>
          <slot name="input-footer-left" slot="footer-left"></slot>
          <slot name="input-actions" slot="actions"></slot>
        </t-chat-input>
      </div>
    );
  }
}
