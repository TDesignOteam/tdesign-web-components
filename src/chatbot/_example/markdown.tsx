import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/space';
import 'tdesign-web-components/switch';

import { Component, signal } from 'omi';
import { TdChatMessageProps } from 'tdesign-web-components/chatbot';

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
      message: {
        id: '123',
        content: [
          {
            type: 'markdown',
            data: mdContent,
          },
        ],
        status: 'complete',
        role: 'assistant',
      },
      chatContentProps: {
        markdown: {
          pluginConfig: [
            // 预设插件
            {
              preset: 'katex',
              enabled: this.hasKatex.value,
            },
          ],
        },
      },
    };
  }

  changeKatexHandler = (e) => {
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
