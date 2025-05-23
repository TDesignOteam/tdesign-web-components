/* eslint-disable */
export class SSEResponse {
  constructor(private isErrorScenario = false) {
    // 默认为非错误场景
  }
  private chunks = [
    { type: 'search', title: '开始获取资料…' },
    { type: 'search', title: '找到 12 篇相关资料...', content: [] },
    { type: 'search', title: '找到 21 篇相关资料...', content: [] },
    { type: 'think', title: '思考中...', content: '嗯.' },
    { type: 'think', title: '思考中...', content: '我现在需' },
    { type: 'think', title: '思考中...', content: '要帮用' },
    { type: 'think', title: '思考中...', content: '户说明一下' },
    { type: 'think', title: '思考中...', content: '假数据是' },
    { type: 'think', title: '思考中...', content: '这是个mock' },
    { type: 'text', msg: '\n\n' },
    { type: 'text', msg: '**' },
    { type: 'text', msg: '参考' },
    { type: 'text', msg: '**\n' },
    // 测试用例1 - 标题开头被截断
    {
      type: 'text',
      msg: '# Markdown功能测试 (H1标题)\n\n## 基础语法测试 (H2标题)\n\n### 文字样式 (H3标题)\n**加粗文字**  \n*斜体文字*  \n~~删除线~~  \n***加粗且斜体***  \n行内代码: `cons',
    },

    // 测试用例2 - 代码块中间截断
    {
      type: 'text',
      msg: "ole.log('Hello')`\n\n### 代码块测试\n```javascript\nfunction greet(name) {\n  console.log(`Hello, ${name}",
    },

    // 测试用例3 - 列表项截断
    {
      type: 'text',
      msg: "!`);\n}\ngreet('Markdown');\n```\n\n### 列表测试\n- 无序列表项1\n- 无序列表项2\n  - 嵌套列表项\n  - 嵌套列表项\n1. 有序列表项1\n2. 有",
    },

    // 测试用例4 - 表格截断
    {
      type: 'text',
      msg: '序列表项2\n\n### 表格测试\n| 左对齐 | 居中对齐 | 右对齐 |\n| :----- | :------: | -----: |\n| 单元格 |  单元格  | 单元',
    },

    // 测试用例5 - 混合内容截断
    {
      type: 'text',
      msg: '格 |\n| 长文本示例 | 中等长度 |  $100 |\n\n### 其他元素\n> 引用文本块  \n> 多行引用内容\n\n---\n\n分割线测试（上方）\n\n脚注测试[^1]\n\n[^1]: 这里',
    },

    // 测试用例6 - HTML标签截断
    {
      type: 'text',
      msg: '是脚注内容\n\n✅ 任务列表：\n- [ ] 未完成任务\n- [x] 已完成任务\n\nHTML混合测试：\n<br>（需要开启html选项）\n<small>辅助文',
    },

    // 测试用例7 - 最终结束段
    {
      type: 'text',
      msg: '字</small>',
    },
  ];

  //@ts-ignore
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getResponse(): Promise<Response> {
    if (this.isErrorScenario) {
      return new Response(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }

    return new Response(
      new ReadableStream({
        start: async (controller) => {
          for (const chunk of this.chunks) {
            controller.enqueue(this.formatChunk(chunk));
            await this.delay(100); // 模拟网络延迟
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      },
    );
  }

  // 添加错误测试用例
  static createResponse(isErr: boolean) {
    return new SSEResponse(isErr);
  }

  private formatChunk(data: any): Uint8Array {
    return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
  }
}
