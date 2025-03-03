/* eslint-disable */

// import ChatEngine from '../core/engine';

// export class MockEngine extends ChatEngine {
//   async processMessage(params: { messageId: string; content: string }) {
//     const assistantId = `mock_${Date.now()}`;
//     const state = this.dependencies.getState();

//     // setTimeout(() => {
//     //   // 模拟AI延迟
//     //   state.messages[assistantId] = {
//     //     id: assistantId,
//     //     role: 'assistant',
//     //     status: 'sent',
//     //     phase: 'complete',
//     //     timestamp: Date.now(),
//     //     content: {
//     //       main: {
//     //         type: 'text',
//     //         text: `Mock回复：${params.content}`,
//     //       },
//     //     },
//     //   };
//     //   state.messageIds.push(assistantId);
//     // }, 1000);

//     // 模拟分块响应
//     const chunks = [
//       JSON.stringify({ thinkingStep: { type: 'search', query: 'TD组件库' }, finalConclusion: '找到相关资料' }),
//       JSON.stringify({ content: '腾讯的TDesign是一套' }),
//       JSON.stringify({ content: '企业级设计体系' }),
//       JSON.stringify({ content: '，提供多端统一解决方案。' }),
//       JSON.stringify({ isComplete: true }),
//     ];

//     // 模拟流式延迟发送
//     for (const [index, chunk] of chunks.entries()) {
//       await new Promise((resolve) => setTimeout(resolve, index * 200));
//       this.handleStreamChunk(`data: ${chunk}\n\n`, assistantId);
//     }
//   }
// }

// export class SSEResponse2 {
//   private controller!: ReadableStreamDefaultController<Uint8Array>;

//   private encoder = new TextEncoder();

//   private stream: ReadableStream<Uint8Array>;

//   private error: boolean;

//   constructor(
//     private data: string,
//     private delay: number = 300,
//     error = false, // 新增参数，默认为false
//   ) {
//     this.error = error;

//     this.stream = new ReadableStream({
//       start: (controller) => {
//         this.controller = controller;
//         if (!this.error) {
//           // 如果不是错误情况，则开始推送数据
//           setTimeout(() => this.pushData(), this.delay); // 延迟开始推送数据
//         }
//       },
//       cancel(reason) {
//         console.log('Stream canceled', reason);
//       },
//     });
//   }

//   private pushData() {
//     if (this.data.length === 0) {
//       this.controller.close();
//       return;
//     }
//     try {
//       const chunk = this.data.slice(0, 1);
//       this.data = this.data.slice(1);
//       this.controller.enqueue(this.encoder.encode(chunk));
//       if (this.data.length > 0) {
//         setTimeout(() => this.pushData(), this.delay);
//       } else {
//         // 数据全部发送完毕后关闭流
//         setTimeout(() => this.controller.close(), this.delay);
//       }
//     } catch {
//       this.controller.error(new Error('Error pushing data'));
//     }
//   }

//   getResponse(): Promise<Response> {
//     return new Promise((resolve) => {
//       // 使用setTimeout来模拟网络延迟
//       setTimeout(() => {
//         if (this.error) {
//           const errorResponseOptions = { status: 500, statusText: 'Internal Server Error' };
//           // 返回模拟的网络错误响应，这里我们使用500状态码作为示例
//           resolve(new Response(null, errorResponseOptions));
//         } else {
//           resolve(new Response(this.stream));
//         }
//       }, this.delay); // 使用构造函数中设置的delay值作为延迟时间
//     });
//   }
// }

export class SSEResponse {
  private chunks = [
    { type: 'search', title: '开始获取资料…' },
    { type: 'search', title: '找到 12 篇相关资料...', content: [] },
    { type: 'search', title: '找到 21 篇相关资料...', content: [] },
    { type: 'think', title: '思考中...', content: '嗯.' },
    { type: 'think', title: '思考中...', content: '我现在需' },
    { type: 'think', title: '思考中...', content: '要帮用' },
    { type: 'text', msg: '\n\n' },
    { type: 'text', msg: '**' },
    { type: 'text', msg: '参考' },
    { type: 'text', msg: '**\n' },
    { type: 'text', msg: '1.**' },
    { type: 'text', msg: '通用场景**' },
    { type: 'text', msg: '  \n' },
    { type: 'text', msg: ' -**动词' },
    { type: 'text', msg: '**' },
  ];

  //@ts-ignore
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getResponse(): Promise<Response> {
    return new Response(
      new ReadableStream({
        start: async (controller) => {
          //@ts-ignore
          for (const chunk of this.chunks) {
            controller.enqueue(this.formatChunk(chunk));
            await this.delay(50);
          }
          controller.close();
        },
      }),
    );
  }

  private formatChunk(data: any): Uint8Array {
    return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
  }
}
