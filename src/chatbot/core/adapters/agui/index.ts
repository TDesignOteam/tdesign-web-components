// import type { AIMessageContent, SearchContent, SSEChunkData, TextContent, ThinkingContent } from '../../type';
// import { EventType } from './events';

// export class AGUIEventMapper {
//   private currentMessageId: string | null = null;

//   private currentContent: AIMessageContent[] = [];

//   mapEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
//     const event = chunk.data;
//     if (!event?.type) return null;

//     switch (event.type) {
//       case EventType.TEXT_MESSAGE_START:
//         this.currentMessageId = event.messageId;
//         this.currentContent = [
//           {
//             type: 'text',
//             data: '',
//             status: 'streaming',
//           },
//         ];
//         return this.currentContent;

//       case EventType.TEXT_MESSAGE_CONTENT:
//         if (!this.currentMessageId) return null;

//         // 更新文本内容
//         const textContent = this.currentContent.find((c) => c.type === 'text');
//         if (textContent && textContent.type === 'text') {
//           textContent.data += event.delta;
//         }
//         return [...this.currentContent];

//       case EventType.TEXT_MESSAGE_END:
//         if (!this.currentMessageId) return null;

//         // 标记文本完成
//         const textContent = this.currentContent.find((c) => c.type === 'text');
//         if (textContent && textContent.type === 'text') {
//           textContent.status = 'complete';
//         }
//         return [...this.currentContent];

//       case EventType.TOOL_CALL_START:
//         this.currentContent.push({
//           type: 'tool_call',
//           data: {
//             name: event.toolCallName,
//             arguments: '',
//           },
//           status: 'pending',
//         });
//         return [...this.currentContent];

//       case EventType.TOOL_CALL_ARGS:
//         const toolCall = this.currentContent.find((c) => c.type === 'tool_call' && c.data?.name === event.toolCallName);
//         if (toolCall && toolCall.type === 'tool_call') {
//           toolCall.data.arguments += event.delta;
//         }
//         return [...this.currentContent];

//       case EventType.TOOL_CALL_RESULT:
//         this.currentContent.push({
//           type: 'text',
//           data: event.content,
//           status: 'complete',
//         });
//         return [...this.currentContent];

//       case EventType.THINKING_START:
//         this.currentContent.push({
//           type: 'thinking',
//           data: { title: '思考中...' },
//           status: 'streaming',
//         });
//         return [...this.currentContent];

//       case EventType.STATE_SNAPSHOT:
//         // 处理状态快照（需要特殊处理）
//         return this.handleStateSnapshot(event.snapshot);

//       default:
//         return null;
//     }
//   }

//   private handleStateSnapshot(snapshot: any): AIMessageContent[] {
//     // 将快照转换为消息内容
//     return snapshot.messages.flatMap((msg: any) => {
//       if (msg.role === 'assistant') {
//         return msg.content.map((content: any) => ({
//           type: content.type,
//           data: content.data,
//           status: 'complete',
//         }));
//       }
//       return [];
//     });
//   }

//   reset() {
//     this.currentMessageId = null;
//     this.currentContent = [];
//   }
// }

// export class AGUIEventMapper {
//   /**
//    * 将AG-UI事件转换为AIMessageContent
//    */
//   mapEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
//     const event = chunk.data;
//     if (!event?.type) return null;

//     switch (event.type) {
//       case EventType.TEXT_MESSAGE_START:
//         return this.handleTextStart(event);
//       case EventType.TEXT_MESSAGE_CONTENT:
//         return this.handleTextContent(event);
//       case EventType.TEXT_MESSAGE_END:
//         return this.handleTextEnd(event);
//       case EventType.THINKING_START:
//         return this.handleThinkingStart(event);
//       case EventType.THINKING_END:
//         return this.handleThinkingEnd(event);
//       case EventType.RUN_STARTED:
//         return this.handleRunStarted(event);
//       case EventType.RUN_FINISHED:
//         return this.handleRunFinished(event);
//       case EventType.RUN_ERROR:
//         return this.handleRunError(event);
//       case EventType.STATE_SNAPSHOT:
//         return this.handleStateSnapshot(event);
//       default:
//         return null;
//     }
//   }

//   private handleTextStart(event: any): TextContent {
//     return {
//       type: 'text',
//       data: '',
//       status: 'streaming',
//     };
//   }

//   private handleTextContent(event: any): TextContent {
//     return {
//       type: 'text',
//       data: event.delta || '',
//       status: 'streaming',
//     };
//   }

//   private handleTextEnd(event: any): TextContent {
//     return {
//       type: 'text',
//       status: 'complete',
//     };
//   }

//   private handleThinkingStart(event: any): ThinkingContent {
//     return {
//       type: 'thinking',
//       data: {
//         title: event.title || '思考中...',
//       },
//       status: 'streaming',
//     };
//   }

//   private handleThinkingEnd(event: any): ThinkingContent {
//     return {
//       type: 'thinking',
//       status: 'complete',
//     };
//   }

//   private handleRunStarted(event: any): ThinkingContent {
//     return {
//       type: 'thinking',
//       data: {
//         title: '开始处理请求...',
//       },
//       status: 'streaming',
//     };
//   }

//   private handleRunFinished(event: any): ThinkingContent {
//     return {
//       type: 'thinking',
//       status: 'complete',
//     };
//   }

//   private handleRunError(event: any): ThinkingContent {
//     return {
//       type: 'thinking',
//       data: {
//         title: '处理出错',
//         text: event.message || '未知错误',
//       },
//       status: 'error',
//     };
//   }

//   private handleStateSnapshot(event: any): SearchContent | null {
//     if (!event.snapshot?.references) return null;

//     return {
//       type: 'search',
//       data: {
//         title: '相关参考资料',
//         references: event.snapshot.references.map((ref: any) => ({
//           title: ref.title,
//           url: ref.url,
//           content: ref.content,
//         })),
//       },
//       status: 'complete',
//     };
//   }
// }

// Demo
// import 'tdesign-web-components/chatbot';
// import { Component } from 'omi';
// import { AGUIEventMapper } from '../core/agui-event-mapper';
// import type { AIMessageContent, ChatMessagesData, SSEChunkData } from '../core/type';

// // AG-UI协议服务配置
// const aguiServiceConfig = {
//   endpoint: 'https://api.agui.chat/sse',
//   protocol: 'agui',
//   agui: {
//     agentId: 'weather-agent',
//     threadId: 'thread-12345',
//   },
//   onMessage: (chunk: SSEChunkData, mapper: AGUIEventMapper) => {
//     return mapper.mapEvent(chunk);
//   },
// };

// export default class AGUIChatDemo extends Component {
//   private eventMapper = new AGUIEventMapper();
//   private chatRef = createRef<Chatbot>();

//   handleSend = async (prompt: string) => {
//     this.eventMapper.reset();

//     // 模拟AG-UI事件流
//     const mockEvents: SSEChunkData[] = [
//       // 文本消息开始
//       {
//         data: {
//           type: EventType.TEXT_MESSAGE_START,
//           messageId: 'msg_123'
//         }
//       },
//       // 文本内容分块
//       {
//         data: {
//           type: EventType.TEXT_MESSAGE_CONTENT,
//           delta: '今天'
//         }
//       },
//       {
//         data: {
//           type: EventType.TEXT_MESSAGE_CONTENT,
//           delta: '北京'
//         }
//       },
//       {
//         data: {
//           type: EventType.TEXT_MESSAGE_CONTENT,
//           delta: '天气'
//         }
//       },
//       // 触发工具调用
//       {
//         data: {
//           type: EventType.TOOL_CALL_START,
//           toolCallId: 'tool_456',
//           toolCallName: 'weather_query'
//         }
//       },
//       // 工具参数
//       {
//         data: {
//           type: EventType.TOOL_CALL_ARGS,
//           delta: '北京'
//         }
//       },
//       // 工具返回结果
//       {
//         data: {
//           type: EventType.TOOL_CALL_RESULT,
//           content: '晴，25°C'
//         }
//       },
//       // 文本消息结束
//       {
//         data: {
//           type: EventType.TEXT_MESSAGE_END
//         }
//       }
//     ];

//     // 模拟事件处理
//     for (const event of mockEvents) {
//       const content = aguiServiceConfig.onMessage(event, this.eventMapper);
//       if (content) {
//         this.chatRef.current?.appendContent('msg_123', content);
//       }
//     }
//   };

//   render() {
//     return (
//       <div>
//         <t-chatbot
//           ref={this.chatRef}
//           style={{ height: '80vh' }}
//           chatServiceConfig={aguiServiceConfig}
//         ></t-chatbot>

//         <div style={{ marginTop: '16px' }}>
//           <t-button onClick={() => this.handleSend('北京天气如何？')}>
//             发送测试消息
//           </t-button>
//         </div>
//       </div>
//     );
//   }
// }

// 在EnhancedSSEClient中处理事件, 将初始化后的eventMapper传入
// client.on('message', (rawEvent) => {
//   const content = config.onMessage?.(rawEvent, eventMapper);
//   if (content) {
//     // 更新消息内容
//   }
// });
