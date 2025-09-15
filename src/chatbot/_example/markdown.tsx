import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/space';
import 'tdesign-web-components/switch';
// 公式能力引入，参考cherryMarkdown示例
import 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';

import { Component, signal } from 'omi';

import { TdChatMessageProps } from '../../chat-message/type';
import mdContent from '../mock/testMarkdown.md?raw';

export default class MarkdownExample extends Component {
  static css = [
    `
      .space::part(md_h3) {
        color: red;
      }
    `,
  ];

  hasKatex = signal(false);

  rerenderKey = signal(1);

  get itemProps(): TdChatMessageProps {
    return {
      variant: 'outline',
      placement: 'left',
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      actions: true,
      id: '123',
      role: 'assistant',
      content: [
        {
          type: 'markdown',
          data: mdContent,
        },
      ],
      status: 'complete',
      chatContentProps: {
        markdown: {
          options: {
            engine: {
              syntax: this.hasKatex.value
                ? {
                    mathBlock: {
                      engine: 'katex',
                    },
                    inlineMath: {
                      engine: 'katex',
                    },
                  }
                : undefined,
            },
          },
        },
      },
    };
  }

  changeKatexHandler = async (e) => {
    this.hasKatex.value = e;
    this.rerenderKey.value += 1;
  };

  render() {
    return (
      <t-space class="space">
        {/* rerenderKey正常写不需要，这里是为了触发重新挂载渲染 */}
        <t-chat-item key={this.rerenderKey.value} {...this.itemProps} />
        <t-space direction="vertical">
          <div style={{ width: '100px' }}>插件配置</div>
          <t-space>
            公式
            <t-switch size="large" value={this.hasKatex.value} onChange={this.changeKatexHandler} />
          </t-space>
        </t-space>
      </t-space>
    );
  }
}
