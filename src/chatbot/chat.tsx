import './chat-list';
import '../chat-sender';
import '../button';

import { merge } from 'lodash-es';
import { Component, createRef, OmiProps, signal, tag } from 'omi';
import { debounceTime } from 'rxjs/operators';

import classname, { getClassPrefix } from '../_util/classname';
import { convertNodeListToVNodes, getSlotNodes } from '../_util/component';
import { TdChatActionsName } from '../chat-action';
import { DefaultChatMessageActionsName } from '../chat-action/action';
import { TdChatSenderParams } from '../chat-sender';
import type ChatSender from '../chat-sender/chat-sender';
import { TdAttachmentItem } from '../filecard';
import { IChatEngine } from './core/base-engine';
import {
  type AttachmentItem,
  type ChatMessagesData,
  type ChatMessageStore,
  type ChatRequestParams,
  type ChatStatus,
} from './core/type';
import type Chatlist from './chat-list';
import ChatEngine, { getMessageContentForCopy, isAIMessage } from './core';
import type {
  AIMessageContent,
  ChatMessageSetterMode,
  TdChatbotApi,
  TdChatListScrollToOptions,
  TdChatMessageActionName,
  TdChatMessageConfig,
  TdChatMessageProps,
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
    engineMode: String,
    defaultMessages: Array,
    messageProps: [Object, Function],
    listProps: Object,
    senderProps: Object,
    chatServiceConfig: [Object, Function],
    injectCSS: Object,
    onMessageChange: Function,
    onChatReady: Function,
    onChatSent: Function,
  };

  static defaultProps = {
    autoSendPrompt: '',
    clearHistory: false,
    layout: 'both',
    reverse: false,
    engineMode: 'default',
  };

  listRef = createRef<Chatlist>();

  ChatSenderRef = createRef<ChatSender>();

  public chatEngine: IChatEngine;

  public chatStatus: ChatStatus = 'idle';

  public isChatEngineReady = false;

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

  get senderLoading() {
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
    const { defaultMessages: messages = [], messageProps, chatServiceConfig: config, autoSendPrompt } = this.props;

    if (typeof messageProps === 'object') {
      this.messageRoleProps = merge({}, this.messageRoleProps, messageProps);
    }

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

    this.fire(
      'chatReady',
      {},
      {
        composed: true,
      },
    );
    this.isChatEngineReady = true;
  }

  /**
   * 同步聊天状态
   * @param {ChatMessagesData[]} state - 新的状态值
   */
  private syncState(state: ChatMessagesData[]) {
    this.chatMessages.value = state;
    this.chatStatus = state.at(-1)?.status || 'idle';
    this.fire('messageChange', state, {
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
  async sendUserMessage(requestParams: ChatRequestParams) {
    await this.chatEngine.sendUserMessage(requestParams);
    this.uploadedAttachments = [];
    this.files.value = [];
    this.scrollList({ to: 'bottom' });
    this.fire('chatSent', requestParams, {
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
    // 检查引擎是否支持sendSystemMessage方法
    if ('sendSystemMessage' in this.chatEngine && typeof this.chatEngine.sendSystemMessage === 'function') {
      this.chatEngine.sendSystemMessage(msg);
    } else {
      console.warn('当前引擎不支持sendSystemMessage方法');
    }
  }

  /**
   * 清空消息列表
   */
  clearMessages() {
    if (!this.isChatEngineReady) return;
    this.chatEngine?.messageStore.clearHistory();
  }

  /**
   * 批量设置消息
   * @param messages 要设置的消息数组
   * @param mode 模式：
   * - replace: 完全替换当前消息（默认）
   * - prepend: 将消息添加到现有消息前面
   * - append: 将消息追加到现有消息后面
   */
  public setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace') {
    if (!this.isChatEngineReady) return;
    if (messages.length === 0) {
      this.clearMessages();
      return;
    }
    this.chatEngine?.messageStore.setMessages(messages, mode);
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
  addPrompt(prompt: string, autoFocus = true) {
    this.ChatSenderRef.current.pValue.value = prompt;
    if (autoFocus) {
      this.ChatSenderRef.current.focus();
    }
  }

  /**
   * 选择文件
   */
  selectFile() {
    this.ChatSenderRef.current.selectFile();
  }

  /**
   * 最后一条AI消息
   */
  get messagesStore(): ChatMessageStore {
    // 兼容不同MessageStore的API
    if ('getState' in this.chatEngine.messageStore && typeof this.chatEngine.messageStore.getState === 'function') {
      return this.chatEngine.messageStore.getState();
    }
    // MessageStoreObservable使用直接属性访问
    const messageStore = this.chatEngine.messageStore as any;
    return {
      messageIds: messageStore.messageIds || messageStore.messages?.map((m: any) => m.id) || [],
      messages: messageStore.messages || [],
    };
  }

  /**
   * 受控滚动
   */
  scrollList(options: TdChatListScrollToOptions) {
    this.listRef.current?.scrollList(options);
  }

  /**
   * 订阅聊天状态变化
   * 优化版本：支持Observable引擎的高级功能
   */
  private subscribeToChat() {
    // 检查是否为Observable版本的引擎
    if ('getMessages$' in this.chatEngine && typeof this.chatEngine.getMessages$ === 'function') {
      // 使用Observable订阅，具有防抖和去重优化
      const subscription = this.chatEngine
        .getMessages$()
        .pipe(
          debounceTime(50), // 防抖50ms，避免频繁更新
        )
        .subscribe((messages: ChatMessagesData[]) => {
          this.syncState(messages);
          this.update();
        });

      this.unsubscribeMsg = () => subscription.unsubscribe();
    } else {
      // 向后兼容：使用传统订阅方式
      this.unsubscribeMsg = this.chatEngine.messageStore.subscribe((state) => {
        this.syncState(state.messages);
        this.update();
      });
    }
  }

  /**
   * 处理发送消息事件
   */
  private handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value, attachments } = e.detail;
    const params = {
      prompt: value,
      attachments,
    } as ChatRequestParams;
    await this.sendUserMessage(params);
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
    action: Partial<TdChatMessageActionName>,
    opts: {
      messageProps: TdChatMessageProps;
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
      const { role, id, content } = item;
      const itemSlotNames = this.slotNames.filter((key) => key.includes(id));
      let itemProps = {
        ...this.messageRoleProps?.[role],
        message: item,
      };
      if (typeof this.props.messageProps === 'function') {
        itemProps = merge({}, itemProps, this.props.messageProps(item) || {});
      }
      return (
        <t-chat-item key={id} className={`${className}-item-wrapper`} {...itemProps} message={item}>
          {/* 根据id筛选item应该分配的slot */}
          {itemSlotNames.map((slotName) => {
            const str = slotName.replace(RegExp(`^${id}-`), '');
            return <slot name={slotName} slot={str}></slot>;
          })}
          {/* 渲染actionBar */}
          {content.length === 0 || (item.status !== 'complete' && item.status !== 'stop') ? null : (
            <t-chat-action
              slot="actionbar"
              actionBar={this.getChatActionBar(itemProps) as TdChatActionsName[]}
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
    // sender-header、sender-footer-prefix、sender-actions、sender-sender
    const itemSlotNames = this.slotNames.filter((key) => key.includes('sender-'));
    return itemSlotNames.map((slotName) => {
      const str = slotName.replace(/^sender-/, '');
      return <slot name={slotName} slot={str}></slot>;
    });
  };

  private getChatActionBar = (messageProps: TdChatMessageProps) => {
    const { actions, message } = messageProps;
    const ids = this.messagesStore.messageIds;
    const isLast = message.id === ids.at(-1);
    const isFirstAI = isAIMessage(message) && message.id === ids[0];
    if (!isAIMessage(message) || !actions || isFirstAI || ids.length === 1) return false;
    let filterActions = actions;
    if (actions === true) filterActions = DefaultChatMessageActionsName;
    if (Array.isArray(filterActions) && !isLast) {
      // 只有最后一条AI消息才能重新生成
      filterActions = filterActions.filter((item) => item !== 'replay');
    }
    return filterActions;
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
      <div className={classname(className, layoutClass)}>
        {this.chatMessageValue && (
          <t-chat-list ref={this.listRef} {...listProps}>
            {this.renderItems()}
          </t-chat-list>
        )}
        <t-chat-sender
          ref={this.ChatSenderRef}
          className={`${className}-input-wrapper`}
          css={injectCSS?.ChatSender}
          loading={this.senderLoading}
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
