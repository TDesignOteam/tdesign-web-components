import './chat-list';
import '../chat-sender';
import '../button';

import { merge } from 'lodash-es';
import { Component, createRef, OmiProps, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { getSlotNodes } from '../_util/component';
import { TdChatInputSend } from '../chat-sender';
import type ChatInput from '../chat-sender/chat-input';
import { Attachment } from '../filecard';
import type { AttachmentItem, AttachmentType, ChatMessageType, ChatStatus, RequestParams } from './core/type';
import type Chatlist from './chat-list';
import ChatEngine from './core';
import type { TdChatMessageConfig, TdChatProps } from './type';

import styles from './style/chat.less';

const className = `${getClassPrefix()}-chat`;
@tag('t-chatbot')
export default class Chatbot extends Component<TdChatProps> {
  static css = [styles];

  static propTypes = {
    clearHistory: Boolean,
    layout: String,
    autoSendPrompt: Object,
    reverse: Boolean,
    messages: Array,
    messageProps: Object,
    senderProps: Object,
    chatServiceConfig: [Object, Function],
    injectCSS: Object,
  };

  static defaultProps = {
    autoSendPrompt: '',
    clearHistory: false,
    layout: 'both',
    reverse: false,
  };

  listRef = createRef<Chatlist>();

  chatInputRef = createRef<ChatInput>();

  public chatEngine: ChatEngine;

  public chatStatus: ChatStatus = 'idle';

  private chatMessages: Omi.SignalValue<ChatMessageType[]> = signal(undefined);

  private uploadedAttachments: AttachmentItem[] = [];

  private unsubscribeMsg?: () => void;

  private files = signal<Attachment[]>([]);

  /**
   * 默认消息角色配置
   */
  private messageRoleProps: TdChatMessageConfig = {
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

  provide = {
    messageStore: {},
    chatEngine: null,
  };

  /**
   * 获取插槽名称列表
   */
  get slotNames() {
    return getSlotNodes(this.props.children).reduce((prev, curr) => prev.concat(curr.attributes.slot), []);
  }

  install() {
    this.chatEngine = new ChatEngine();
  }

  ready(): void {
    this.initChat();
    this.update();
  }

  /**
   * 获取当前聊天消息值
   * @returns {Array<ChatMessageType>} 当前聊天消息数组
   */
  get chatMessageValue() {
    return this.chatMessages.value;
  }

  /**
   * 初始化聊天
   * 合并消息配置、初始化引擎、同步状态、订阅聊天
   */
  private initChat() {
    const { messages, messageProps, chatServiceConfig: config, autoSendPrompt } = this.props;
    this.messageRoleProps = merge({}, this.messageRoleProps, messageProps);
    this.chatEngine.init(config, messages);
    const { messageStore } = this.chatEngine;
    this.provide.messageStore = messageStore;
    this.provide.chatEngine = this.chatEngine;
    this.syncState(messages);
    this.subscribeToChat();
    // 如果有传入autoSendPrompt，自动发起提问
    if (autoSendPrompt !== '' && autoSendPrompt !== 'undefined') {
      this.chatEngine.sendUserMessage({
        prompt: autoSendPrompt,
      });
    }
  }

  /**
   * 同步聊天状态
   * @param {ChatMessageType[]} state - 新的状态值
   */
  private syncState(state) {
    this.chatMessages.value = state;
    this.chatStatus = state.at(-1)?.status || 'idle';
    this.fire('message_change', state, {
      composed: true,
    });
  }

  uninstall() {
    this.unsubscribeMsg?.();
    this.handleStop();
  }

  /**
   * 发送用户消息
   */
  async sendUserMessage(requestParams: RequestParams) {
    await this.chatEngine.sendUserMessage(requestParams);
    this.uploadedAttachments = [];
    this.files.value = [];
    this.scrollToBottom();
    this.fire('chat_submit', requestParams, {
      composed: true,
    });
  }

  /**
   * 发送系统消息
   */
  sendSystemMessage(msg: string) {
    this.chatEngine.sendSystemMessage(msg);
  }

  /**
   * 中止聊天
   */
  async abortChat() {
    await this.chatEngine.abortChat();
    this.update();
  }

  /**
   * 添加提示信息到输入框
   */
  addPrompt(prompt: string) {
    this.chatInputRef.current.pValue.value = prompt;
    this.chatInputRef.current.inputRef.current.focus();
  }

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    this.listRef.current?.scrollToBottom();
  }

  /**
   * 订阅聊天状态变化
   */
  private subscribeToChat() {
    this.unsubscribeMsg = this.chatEngine.messageStore.subscribe((state) => {
      this.syncState(state.messages);
      this.update();
    });
  }

  /**
   * 处理发送消息事件
   */
  private handleSend = async (e: CustomEvent<TdChatInputSend>) => {
    const { value } = e.detail;
    const params = {
      prompt: value,
      attachments: this.uploadedAttachments,
    };
    if (this.props?.senderProps?.onSend) {
      await this.props.senderProps.onSend(e);
    }
    await this.sendUserMessage(params);
    this.scrollToBottom();
  };

  /**
   * 处理停止聊天事件
   */
  private handleStop = () => {
    this.chatEngine.abortChat();
    this.fire(
      'chat_stop',
      {},
      {
        composed: true,
      },
    );
  };

  /**
   * 处理附件移除事件
   */
  private onAttachmentsRemove = (e: CustomEvent<File[]>) => {
    this.files.value = e.detail;
  };

  /**
   * 处理附件选择事件
   */
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

  /**
   * 渲染消息项
   */
  private renderItems = () => {
    const items = this.props.reverse ? [...this.chatMessageValue].reverse() : this.chatMessageValue;
    return items.map((item) => {
      const { role, id } = item;
      const itemSlotNames = this.slotNames.filter((key) => key.includes(id));
      return (
        <t-chat-item key={id} className={`${className}-item-wrapper`} {...this.messageRoleProps?.[role]} message={item}>
          {/* 根据id筛选item应该分配的slot */}
          {itemSlotNames.map((slotName) => {
            const str = slotName.replace(RegExp(`^${id}-`), '');
            return <slot name={slotName} slot={str}></slot>;
          })}
        </t-chat-item>
      );
    });
  };

  /**
   * 渲染输入框插槽
   */
  private renderInputSlots = () => {
    // input-header、input-footer-left、input-actions、input-sender
    const itemSlotNames = this.slotNames.filter((key) => key.includes('input-'));
    return itemSlotNames.map((slotName) => {
      const str = slotName.replace(/^input-/, '');
      return <slot name={slotName} slot={str}></slot>;
    });
  };

  render({ layout, injectCSS, senderProps }: OmiProps<TdChatProps>) {
    const layoutClass = layout === 'both' ? `${className}-layout-both` : `${className}-layout-single`;
    // console.log('====render chat', this.messages);
    return (
      <div className={`${className} ${layoutClass}`}>
        {this.chatMessageValue && <t-chat-list ref={this.listRef}>{this.renderItems()}</t-chat-list>}
        <t-chat-input
          ref={this.chatInputRef}
          className={`${className}-input-wrapper`}
          css={injectCSS?.chatInput}
          status={this.chatStatus}
          autosize={{ minRows: 2 }}
          attachmentsProps={{
            items: this.files.value,
          }}
          {...senderProps}
          onSend={this.handleSend}
          onStop={this.handleStop}
          onFileSelect={this.onAttachmentsSelect}
          onFileRemove={this.onAttachmentsRemove}
        >
          {/* 如不使用动态渲染slot，input中的默认slot会被置空 */}
          {this.renderInputSlots()}
        </t-chat-input>
      </div>
    );
  }
}
