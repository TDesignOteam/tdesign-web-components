import type { AIMessageContent, SSEChunkData } from '../../type';
import { EventType } from './events';

/**
 * AGUIEventMapper
 * 将AG-UI协议事件（SSEChunkData）转换为AIMessageContent[]
 * 支持多轮对话、增量文本、工具调用、思考、状态快照、消息快照等基础事件
 */
export class AGUIEventMapper {
  private currentMessageId: string | null = null;

  private currentContent: AIMessageContent[] = [];

  private toolCallMap: Record<string, any> = {};

  /**
   * 主入口：将SSE事件转换为AIMessageContent[]
   */
  mapEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
    const event = chunk.data;
    if (!event?.type) return null;
    switch (event.type) {
      case 'TEXT_MESSAGE_START':
        return {
          type: 'markdown',
          status: 'streaming',
          data: '',
          strategy: 'append',
        };
      case 'TEXT_MESSAGE_CHUNK':
      case 'TEXT_MESSAGE_END':
        return {
          type: 'markdown',
          status: event.type === 'TEXT_MESSAGE_END' ? 'complete' : 'streaming',
          data: event.delta || '',
          strategy: 'merge',
        };
      case EventType.TOOL_CALL_START:
        this.toolCallMap[event.toolCallId] = {
          name: event.toolCallName,
          arguments: '',
        };
        this.currentContent.push({
          type: 'search',
          data: {
            title: event.toolCallName,
            references: [],
          },
          status: 'pending',
        });
        return [...this.currentContent];
      case EventType.TOOL_CALL_ARGS:
        if (this.toolCallMap[event.toolCallId]) {
          this.toolCallMap[event.toolCallId].arguments += event.delta;
        }
        return [...this.currentContent];
      case EventType.TOOL_CALL_END:
        // 工具调用结束，状态可更新
        return [...this.currentContent];
      case EventType.TOOL_CALL_RESULT:
        this.currentContent.push({
          type: 'markdown',
          data: event.content,
          status: 'complete',
        });
        return [...this.currentContent];
      case EventType.THINKING_START:
        this.currentContent.push({
          type: 'thinking',
          data: { title: event.title || '思考中...' },
          status: 'streaming',
        });
        return [...this.currentContent];
      case EventType.THINKING_END:
        // 标记最后一个thinking为complete
        for (let i = this.currentContent.length - 1; i >= 0; i--) {
          const content = this.currentContent[i];
          if (content.type === 'thinking' && 'status' in content) {
            (content as any).status = 'complete';
            break;
          }
        }
        return [...this.currentContent];
      case EventType.STATE_SNAPSHOT:
        return this.handleStateSnapshot(event.snapshot);
      case EventType.MESSAGES_SNAPSHOT:
        return this.handleMessagesSnapshot(event.messages);
      case EventType.CUSTOM:
        return this.handleCustomEvent(event);
      case EventType.RUN_ERROR:
        return [
          {
            type: 'text',
            data: event.message || event.error || 'Unknown error',
            status: 'error',
          },
        ];
      default:
        return null;
    }
  }

  private handleStateSnapshot(snapshot: any): AIMessageContent[] {
    // 只取assistant消息
    if (!snapshot?.messages) return [];
    return snapshot.messages.flatMap((msg: any) => {
      if (msg.role === 'assistant' && Array.isArray(msg.content)) {
        return msg.content.map((content: any) => ({
          type: content.type || 'markdown',
          data: content.data,
          status: 'complete',
        }));
      }
      return [];
    });
  }

  private handleMessagesSnapshot(messages: any[]): AIMessageContent[] {
    // 只取assistant消息
    if (!messages) return [];
    return messages.flatMap((msg: any) => {
      if (msg.role === 'assistant' && Array.isArray(msg.content)) {
        return msg.content.map((content: any) => ({
          type: content.type || 'markdown',
          data: content.data,
          status: 'complete',
        }));
      }
      return [];
    });
  }

  private handleCustomEvent(event: any): AIMessageContent[] {
    // 约定：thinking/search等类型自定义事件
    if (event.name === 'thinking' || event.value?.type === 'thinking') {
      return [
        {
          type: 'thinking',
          data: {
            title: event.value?.title || event.value?.content || '思考中...',
            text: event.value?.text,
          },
          status: 'streaming',
        },
      ];
    }
    if (event.name === 'search' || event.value?.type === 'search') {
      return [
        {
          type: 'search',
          data: {
            title: event.value?.title || 'Search',
            references: event.value?.references || [],
          },
          status: 'complete',
        },
      ];
    }
    // 兜底：以text类型输出
    return [
      {
        type: 'text',
        data: event.value?.content || event.value?.text || JSON.stringify(event.value),
        status: 'complete',
      },
    ];
  }

  reset() {
    this.currentMessageId = null;
    this.currentContent = [];
    this.toolCallMap = {};
  }
}

export default AGUIEventMapper;
