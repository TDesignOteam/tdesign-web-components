import 'tdesign-web-components/chatbot/chat-list';
import 'tdesign-web-components/chat-message';

import { Component, signal } from 'omi';

import type { ChatMessagesData } from '../../chat-engine/type';

/** 每次加载的消息数量 */
const PAGE_SIZE = 10;

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
            data: `这是第 ${i + 1} 条用户消息，用于测试外部数据分页（组件内控）。`,
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
            } 条 **AI 回复**。\n\n此示例由 \`chat-list\` 内部自动处理滚动阈值判断和滚动位置维持，用户只需传入 \`hasMore\` 和 \`onLoadMore\` 即可。`,
          },
        ],
      });
    }
  }
  return messages;
}

export default class DataPagingInnerExample extends Component {
  static css = [
    `
      .data-paging-inner-demo {
        display: flex;
        flex-direction: column;
        height: 80vh;
        border: 1px solid var(--td-border-level-2-color, #dcdcdc);
        border-radius: 8px;
        overflow: hidden;
      }
      .data-paging-inner-demo__header {
        padding: 12px 16px;
        border-bottom: 1px solid var(--td-border-level-2-color, #dcdcdc);
        background: var(--td-bg-color-container, #fff);
        font-size: 14px;
        color: var(--td-text-color-secondary, rgba(0, 0, 0, 0.6));
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .data-paging-inner-demo__info {
        display: flex;
        gap: 16px;
      }
      .data-paging-inner-demo__tag {
        padding: 2px 8px;
        border-radius: 4px;
        background: var(--td-brand-color-light, #ecf2fe);
        color: var(--td-brand-color, #0052d9);
        font-size: 12px;
      }
      .data-paging-inner-demo__tag--success {
        background: var(--td-success-color-1, #e8f8e8);
        color: var(--td-success-color, #2ba471);
      }
    `,
  ];

  /** 全量消息数据源 */
  allMessages: ChatMessagesData[] = generateAllMessages(100);

  /** 当前渲染的消息切片（初始为最后一页） */
  visibleMessages = signal<ChatMessagesData[]>(this.allMessages.slice(-PAGE_SIZE));

  /** 是否还有更多历史消息 */
  hasMore = signal(this.allMessages.length > PAGE_SIZE);

  /**
   * 加载更多历史消息
   * chat-list 在滚动到顶部阈值时自动触发此回调，
   * 内部自动处理滚动位置维持，用户只需更新数据
   */
  handleLoadMore = () => {
    // 模拟异步加载延迟（实际场景中这里是接口请求）
    setTimeout(() => {
      const currentCount = this.visibleMessages.value.length;
      const totalCount = this.allMessages.length;
      const remainingCount = totalCount - currentCount;

      if (remainingCount <= 0) {
        this.hasMore.value = false;
        return;
      }

      // 从全量数据中取出更早的消息
      const loadCount = Math.min(PAGE_SIZE, remainingCount);
      const startIndex = totalCount - currentCount - loadCount;
      const olderMessages = this.allMessages.slice(startIndex, startIndex + loadCount);

      // 将更早的消息 prepend 到可见列表前面
      // chat-list 内部会自动维持滚动位置，无需用户处理
      this.visibleMessages.value = [...olderMessages, ...this.visibleMessages.value];

      // 更新状态
      if (this.visibleMessages.value.length >= totalCount) {
        this.hasMore.value = false;
      }

      console.log(`[DataPagingInner] 已加载 ${this.visibleMessages.value.length}/${totalCount} 条消息`);
    }, 300);
  };

  render() {
    const visible = this.visibleMessages.value;
    const total = this.allMessages.length;
    const hasMore = this.hasMore.value;

    return (
      <div className="data-paging-inner-demo">
        <div className="data-paging-inner-demo__header">
          <span>数据分页示例</span>
          <div className="data-paging-inner-demo__info">
            <span className="data-paging-inner-demo__tag">
              DOM 节点：{visible.length} / {total}
            </span>
          </div>
        </div>

        {/*
          数据分页：
          - hasMore: 告诉 chat-list 还有更多数据
          - onLoadMore: chat-list 在滚动到顶部阈值时自动触发此回调
          - chat-list 内部自动处理：阈值判断 + 滚动位置维持 + 加载状态管理
        */}
        <t-chat-list defaultScrollTo="bottom" hasMore={hasMore} onLoadMore={this.handleLoadMore}>
          {visible.map((msg) => (
            <t-chat-item
              key={msg.id}
              id={msg.id}
              role={msg.role}
              content={msg.content}
              status={msg.status}
              variant="text"
              placement={msg.role === 'user' ? 'right' : 'left'}
              avatar={
                msg.role === 'user'
                  ? 'https://tdesign.gtimg.com/site/avatar.jpg'
                  : 'https://tdesign.gtimg.com/site/chat-avatar.png'
              }
              name={msg.role === 'user' ? '用户' : 'AI 助手'}
            />
          ))}
        </t-chat-list>
      </div>
    );
  }
}
