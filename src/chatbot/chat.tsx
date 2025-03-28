import './ui/chat-list';
import '../chat-input';
import '../button';

import { merge } from 'lodash-es';
import { Component, createRef, OmiProps, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { getSlotNodes } from '../_util/component';
import { TdChatInputSend } from '../chat-input';
import { Attachment } from '../filecard';
import type { AttachmentItem, AttachmentType, ChatStatus, Message } from './core/type';
import ChatEngine from './core';
import type { TdChatListProps, TdChatProps, TdChatRolesConfig } from './type';

import styles from './style/chat.less';

const className = `${getClassPrefix()}-chat`;
@tag('t-chatbot')
export default class Chatbot extends Component<TdChatProps> {
  static css = [styles];

  static propTypes = {
    clearHistory: Boolean,
    layout: String,
    autoSendPrompt: String,
    reverse: Boolean,
    messages: Array,
    rolesConfig: Object,
    senderProps: Object,
    chatService: Object,
    injectCSS: Object,
  };

  static defaultProps = {
    clearHistory: false,
    layout: 'both',
    reverse: false,
    messages: [],
  };

  listRef = createRef<TdChatListProps>();

  public chatMessages: Message[] = [];

  public chatEngine: ChatEngine;

  private chatStatus: ChatStatus = 'idle';

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
    const { messages, rolesConfig, chatService: config, autoSendPrompt } = this.props;
    this.rolesConfig = merge(this.presetRoleConfig, rolesConfig);
    this.chatEngine = new ChatEngine(config, messages);
    const { messageStore } = this.chatEngine;
    this.provide.messageStore = messageStore;
    this.provide.chatEngine = this.chatEngine;
    if (messageStore.currentMessage) {
      this.chatStatus = messageStore.currentMessage.status;
    }
    this.chatMessages = messageStore.getState().messages;
    console.log('====initChat', messages, config, this.rolesConfig, this.chatStatus);
    this.subscribeToChat();
    // 如果有传入autoSendPrompt，自动发起提问
    if (autoSendPrompt) {
      this.chatEngine.sendMessage({
        prompt: autoSendPrompt,
      });
    }
  }

  uninstall() {
    this.unsubscribeMsg?.();
    this.handleStop();
  }

  // 订阅聊天状态变化
  private subscribeToChat() {
    this.unsubscribeMsg = this.chatEngine.messageStore.subscribe(
      (state) => {
        this.chatMessages = state.messages;
        this.chatStatus = this.chatMessages.at(-1)?.status || 'idle';
        this.update();
      },
      // ['messageIds'],
    );
  }

  private presetRoleConfig: TdChatRolesConfig = {
    user: {
      variant: 'text',
      placement: 'right',
    },
    assistant: {
      variant: 'text',
      placement: 'left',
      actions: (preset) => preset,
    },
    system: {},
  };

  rolesConfig = this.presetRoleConfig;

  private handleSend = async (e: CustomEvent<TdChatInputSend>) => {
    const { value } = e.detail;
    await this.chatEngine.sendMessage({
      prompt: value,
      attachments: this.uploadedAttachments,
    });
    this.uploadedAttachments = [];
    this.files.value = [];
    this.fire('submit', value, {
      composed: true,
    });
  };

  private handleStop = () => {
    this.chatEngine.abortChat();
    this.fire('stop');
  };

  private onAttachmentsRemove = (e: CustomEvent<File[]>) => {
    console.log('onAttachmentsRemove', e);
    this.files.value = e.detail;
  };

  private onAttachmentsSelect = async (e: CustomEvent<File[]>) => {
    const uploadedResult = await this.props?.senderProps?.onFileSelect?.(e.detail);
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
    const slotNames: string[] = getSlotNodes(this.props.children).reduce(
      (prev, curr) => prev.concat(curr.attributes.slot),
      [],
    );
    const items = this.props.reverse ? [...this.chatMessages].reverse() : this.chatMessages;
    return items.map((item) => {
      const { role, id } = item;
      const itemSlotNames = slotNames.filter((key) => key.includes(id));
      return (
        <t-chat-item key={id} className={`${className}-item-wrapper`} {...this.rolesConfig?.[role]} message={item}>
          {/* 根据id筛选item应该分配的slot */}
          {itemSlotNames.map((slotName) => (
            <slot name={slotName} slot={slotName}></slot>
          ))}
        </t-chat-item>
      );
    });
  };

  render({ layout, injectCSS, senderProps }: OmiProps<TdChatProps>) {
    const layoutClass = layout === 'both' ? `${className}-layout-both` : `${className}-layout-single`;
    // console.log('====render chat', this.messages);
    return (
      <div className={`${className} ${layoutClass}`}>
        {this.chatMessages && <t-chat-list ref={this.listRef}>{this.renderItems()}</t-chat-list>}
        <t-chat-input
          className={`${className}-input-wrapper`}
          css={injectCSS?.chatInput}
          status={this.chatStatus}
          actions
          allowStop
          autosize={{ minRows: 2 }}
          onSend={this.handleSend}
          onStop={this.handleStop}
          attachmentsProps={{
            items: this.files.value,
          }}
          onFileSelect={this.onAttachmentsSelect}
          onFileRemove={this.onAttachmentsRemove}
          {...senderProps}
        >
          <slot name="input-header" slot="header"></slot>
          <slot name="input-footer-left" slot="footer-left"></slot>
          <slot name="input-actions" slot="actions"></slot>
        </t-chat-input>
      </div>
    );
  }
}
