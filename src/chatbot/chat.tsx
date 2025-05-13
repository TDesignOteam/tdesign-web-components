import './chat-list';
import '../chat-sender';
import '../button';

import { merge } from 'lodash-es';
import { Component, createRef, OmiProps, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { convertNodeListToVNodes, getSlotNodes } from '../_util/component';
import { TdChatActionsName } from '../chat-action';
import { DefaultChatMessageActionsName } from '../chat-action/action';
import { TdChatSenderSend } from '../chat-sender';
import type ChatSender from '../chat-sender/chat-sender';
import { TdAttachmentItem } from '../filecard';
import {
  type AttachmentItem,
  type ChatMessagesData,
  type ChatMessageStore,
  type ChatStatus,
  type RequestParams,
} from './core/type';
import type Chatlist from './chat-list';
import ChatEngine, { getMessageContentForCopy, isAIMessage } from './core';
import type {
  AIMessageContent,
  TdChatbotApi,
  TdChatItemActionName,
  TdChatItemProps,
  TdChatMessageConfig,
  TdChatProps,
} from './type';

import styles from './style/chat.less';

const className = `${getClassPrefix()}-chat`;
@tag('t-chatbot')
export default class Chatbot extends Component<TdChatProps> implements TdChatbotApi {
  static css = [styles];

  static propTypes = {
    clearHistory: Boolean,
    layout: String,
    autoSendPrompt: Object,
    reverse: Boolean,
    messages: Array,
    messageProps: Object,
    listProps: Object,
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

  ChatSenderRef = createRef<ChatSender>();

  public chatEngine: ChatEngine;

  public chatStatus: ChatStatus = 'idle';

  private chatMessages: Omi.SignalValue<ChatMessagesData[]> = signal(undefined);

  private uploadedAttachments: AttachmentItem[] = [];

  private unsubscribeMsg?: () => void;

  private files = signal<TdAttachmentItem[]>([]);

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

  get inputLoading() {
    if (this.chatStatus === 'pending' || this.chatStatus === 'streaming') {
      return true;
    }
    return false;
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
   * @returns {Array<ChatMessagesData>} 当前聊天消息数组
   */
  get chatMessageValue() {
    return this.chatMessages.value;
  }

  /**
   * 初始化聊天
   * 合并消息配置、初始化引擎、同步状态、订阅聊天
   */
  private initChat() {
    const { messages = [], messageProps, chatServiceConfig: config, autoSendPrompt } = this.props;
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
   * @param {ChatMessagesData[]} state - 新的状态值
   */
  private syncState(state: ChatMessagesData[]) {
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
   * 重新回答
   */
  async regenerate(keepVersion: boolean = false) {
    await this.chatEngine.regenerateAIMessage(keepVersion);
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
   * 注册自定义消息内容合并策略
   */
  public registerMergeStrategy<T extends AIMessageContent>(
    type: T['type'], // 使用类型中定义的type字段作为参数类型
    handler: (chunk: T, existing?: T) => T,
  ) {
    this.chatEngine.registerMergeStrategy(type, handler);
  }

  /**
   * 添加提示信息到输入框
   */
  addPrompt(prompt: string) {
    this.ChatSenderRef.current.pValue.value = prompt;
    this.ChatSenderRef.current.focus();
  }

  /**
   * 最后一条AI消息
   */
  get messagesStore(): ChatMessageStore {
    return this.chatEngine?.messageStore.getState();
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
  private handleSend = async (e: CustomEvent<TdChatSenderSend>) => {
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

  private handleClickAction = (
    action: Partial<TdChatItemActionName>,
    opts: {
      messageProps: TdChatItemProps;
      data?: any;
    },
  ) => {
    const { messageProps, data } = opts;
    const toData = {
      ...data,
      message: messageProps.message,
    };
    if (messageProps?.handleActions?.[action]) {
      messageProps.handleActions[action](toData);
    }
    this.fire(
      'chat_message_action',
      { action, data: toData },
      {
        composed: true,
      },
    );
  };

  /**
   * 渲染消息项
   */
  private renderItems = () => {
    const items = this.props.reverse ? [...this.chatMessageValue].reverse() : this.chatMessageValue;
    return items.map((item) => {
      const { role, id } = item;
      const itemSlotNames = this.slotNames.filter((key) => key.includes(id));
      const isLast = id === this.messagesStore.messageIds.at(-1);
      const itemProps = {
        ...this.messageRoleProps?.[role],
        message: item,
        isLast,
      };
      return (
        <t-chat-item key={id} className={`${className}-item-wrapper`} {...this.messageRoleProps?.[role]} message={item}>
          {/* 根据id筛选item应该分配的slot */}
          {itemSlotNames.map((slotName) => {
            const str = slotName.replace(RegExp(`^${id}-`), '');
            return <slot name={slotName} slot={str}></slot>;
          })}
          {/* 渲染actionBar */}
          {item.status !== 'complete' && item.status !== 'stop' ? null : (
            <t-chat-action
              slot="actionbar"
              actionBar={getChatActionBar(itemProps) as TdChatActionsName[]}
              handleAction={(action, data) =>
                this.handleClickAction(action, {
                  messageProps: itemProps,
                  data,
                })
              }
              copyText={getMessageContentForCopy(item)}
              comment={isAIMessage(item) ? item.comment : false}
            />
          )}
        </t-chat-item>
      );
    });
  };

  /**
   * 渲染输入框插槽
   */
  private renderInputSlots = () => {
    // sender-header、sender-footer-left、sender-actions、sender-sender
    const itemSlotNames = this.slotNames.filter((key) => key.includes('sender-'));
    return itemSlotNames.map((slotName) => {
      const str = slotName.replace(/^sender-/, '');
      return <slot name={slotName} slot={str}></slot>;
    });
  };

  // 动态注入插槽需要每次render都更新children
  beforeRender(): void {
    // @ts-ignore
    if (this.props?.ignoreAttrs) return;
    // 使用缓存和差异检测优化DOM转换
    this.props.children = convertNodeListToVNodes(this.childNodes);
  }

  render({ layout, injectCSS, senderProps, listProps }: OmiProps<TdChatProps>) {
    const layoutClass = layout === 'both' ? `${className}-layout-both` : `${className}-layout-single`;
    return (
      <div className={`${className} ${layoutClass}`}>
        {this.chatMessageValue && (
          <t-chat-list ref={this.listRef} {...listProps}>
            {this.renderItems()}
          </t-chat-list>
        )}
        <t-chat-sender
          ref={this.ChatSenderRef}
          className={`${className}-input-wrapper`}
          css={injectCSS?.ChatSender}
          loading={this.inputLoading}
          autosize={{ minRows: 2 }}
          attachmentsProps={{
            items: this.files.value,
          }}
          {...senderProps}
          onSend={this.handleSend}
          onStop={this.handleStop}
        >
          {/* 如不使用动态渲染slot，input中的默认slot会被置空 */}
          {this.renderInputSlots()}
        </t-chat-sender>
      </div>
    );
  }
}

function getChatActionBar(
  messageProps: TdChatItemProps & {
    isLast: boolean;
  },
) {
  const { actions, isLast, message } = messageProps;
  if (!isAIMessage(message) || !actions) return false;
  let filterActions = actions;
  if (!actions) filterActions = DefaultChatMessageActionsName;
  if (Array.isArray(filterActions) && !isLast) {
    // 只有最后一条AI消息才能重新生成
    filterActions = filterActions.filter((item) => item !== 'replay');
  }
  return filterActions;
}
