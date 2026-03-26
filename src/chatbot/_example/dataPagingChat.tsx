import 'tdesign-web-components/chatbot';

import { Component, createRef, signal } from 'omi';

import type { ChatMessagesData } from '../../chat-engine/type';
import type Chatbot from '../chat';

/** 每次加载的消息数量 */
const PAGE_SIZE = 10;

/** 全量消息总数 */
const TOTAL_COUNT = 100;

/**
 * 模拟全量消息数据源（如后端接口返回的历史消息列表）
 */
function generateAllMessages(count: number): ChatMessagesData[] {
  const messages: ChatMessagesData[] = [];
  for (let i = 0; i < count; i++) {
    const isUser = i % 2 === 0;
    if (isUser) {
      messages.push({
        id: `msg-${i}`,
        role: 'user',
        status: 'complete',
        content: [
          {
            type: 'text',
            data: `这是第 ${i + 1} 条用户消息，用于测试 t-chatbot 组件的数据分页功能。`,
          },
        ],
      });
    } else {
      messages.push({
        id: `msg-${i}`,
        role: 'assistant',
        status: 'complete',
        content: [
          {
            type: 'markdown',
            data: `这是第 ${
              i + 1
            } 条 **AI 回复**。\n\n此示例使用 \`t-chatbot\` 组件，通过 \`setMessages('prepend')\` 和 \`listProps\` 实现外部数据分页。`,
          },
        ],
      });
    }
  }
  return messages;
}

/**
 * 使用 t-chatbot 组件实现外部数据分页的示例
 *
 * 核心用法：
 * 1. 通过 listProps.hasMore + listProps.onLoadMore 让 chat-list 在滚动到顶部时触发加载
 * 2. 通过 chatRef.setMessages(olderMessages, 'prepend') 将历史消息插入到前面
 * 3. chat-list 内部自动处理滚动位置维持，无需手动处理
 */
export default class DataPagingChatExample extends Component {
  static css = [
    `
      .data-paging-chat-demo {
        display: flex;
        flex-direction: column;
        height: 80vh;
        border: 1px solid var(--td-border-level-2-color, #dcdcdc);
        border-radius: 8px;
        overflow: hidden;
      }
      .data-paging-chat-demo__header {
        padding: 12px 16px;
        border-bottom: 1px solid var(--td-border-level-2-color, #dcdcdc);
        background: var(--td-bg-color-container, #fff);
        font-size: 14px;
        color: var(--td-text-color-secondary, rgba(0, 0, 0, 0.6));
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .data-paging-chat-demo__info {
        display: flex;
        gap: 16px;
      }
      .data-paging-chat-demo__tag {
        padding: 2px 8px;
        border-radius: 4px;
        background: var(--td-brand-color-light, #ecf2fe);
        color: var(--td-brand-color, #0052d9);
        font-size: 12px;
      }
      .data-paging-chat-demo__tag--warn {
        background: var(--td-warning-color-1, #fff8e8);
        color: var(--td-warning-color, #e37318);
      }
    `,
  ];

  chatRef = createRef<Chatbot>();

  /** 全量消息数据源 */
  allMessages: ChatMessagesData[] = generateAllMessages(TOTAL_COUNT);

  /** 当前已加载的消息数量 */
  loadedCount = signal(PAGE_SIZE);

  /** 是否还有更多历史消息 */
  hasMore = signal(TOTAL_COUNT > PAGE_SIZE);

  /**
   * 加载更多历史消息
   * 通过 setMessages('prepend') 将更早的消息插入到列表前面
   * chat-list 内部自动维持滚动位置
   */
  handleLoadMore = () => {
    const currentCount = this.loadedCount.value;
    const totalCount = this.allMessages.length;
    const remainingCount = totalCount - currentCount;

    if (remainingCount <= 0) {
      this.hasMore.value = false;
      return;
    }

    // 模拟异步加载延迟
    setTimeout(() => {
      const loadCount = Math.min(PAGE_SIZE, remainingCount);
      const startIndex = totalCount - currentCount - loadCount;
      const olderMessages = this.allMessages.slice(startIndex, startIndex + loadCount);

      // 核心：使用 setMessages('prepend') 将历史消息插入前面
      this.chatRef.current?.setMessages(olderMessages, 'prepend');

      this.loadedCount.value = currentCount + loadCount;

      // 更新 hasMore 状态
      if (this.loadedCount.value >= totalCount) {
        this.hasMore.value = false;
      }

      console.log(`[DataPagingChat] 已加载 ${this.loadedCount.value}/${totalCount} 条消息`);
    }, 300);
  };

  render() {
    const loaded = this.loadedCount.value;
    const total = this.allMessages.length;
    const hasMore = this.hasMore.value;
    return (
      <div className="data-paging-chat-demo">
        <div className="data-paging-chat-demo__header">
          <span>t-chatbot 数据分页示例</span>
          <div className="data-paging-chat-demo__info">
            <span className="data-paging-chat-demo__tag">
              已加载：{loaded} / {total}
            </span>
          </div>
        </div>

        {/*
          使用 t-chatbot 组件实现外部数据分页：
          1. 通过 defaultMessages 传入初始消息（最后一页）
          2. 通过 listProps 传入 hasMore 和 onLoadMore
          3. 在 onLoadMore 回调中使用 setMessages('prepend') 加载更早的消息
        */}
        <t-chatbot
          ref={this.chatRef}
          style={{ display: 'block', height: '100%' }}
          defaultMessages={this.allMessages.slice(-PAGE_SIZE)}
          listProps={{
            defaultScrollTo: 'bottom',
            hasMore,
            onLoadMore: this.handleLoadMore,
          }}
          senderProps={{
            placeholder: '请输入消息（本示例仅演示分页，不连接后端）',
          }}
          messageProps={(msg: ChatMessagesData) => ({
            variant: 'text',
            placement: msg.role === 'user' ? 'right' : 'left',
            avatar:
              msg.role === 'user'
                ? 'https://tdesign.gtimg.com/site/avatar.jpg'
                : 'https://tdesign.gtimg.com/site/chat-avatar.png',
            name: msg.role === 'user' ? '用户' : 'AI 助手',
          })}
        />
      </div>
    );
  }
}
