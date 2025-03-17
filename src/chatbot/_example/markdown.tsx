import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/space';
import 'tdesign-web-components/switch';

import { Component, signal } from 'omi';
import { TdChatItemProps } from 'tdesign-web-components/chatbot';

import mdContent from '../mock/testMarkdown.md?raw';

export default class MarkdownExample extends Component {
  hasCode = signal(false);

  hasKatex = signal(false);

  rerenderKey = signal(1);

  get itemProps(): TdChatItemProps {
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
        markdownProps: {
          options: {
            html: true,
            breaks: true,
            linkify: true,
            typographer: true,
          },
          pluginConfig: [
            // 预设插件
            {
              preset: 'code',
              enabled: this.hasCode.value,
            },
            {
              preset: 'katex',
              enabled: this.hasKatex.value,
            },
          ],
        },
      },
    };
  }

  changeCodeHandler = (e) => {
    this.hasCode.value = e;
    this.rerenderKey.value += 1;
  };

  changeKatexHandler = (e) => {
    this.hasKatex.value = e;
    this.rerenderKey.value += 1;
  };

  render() {
    return (
      <t-space>
        {/* rerenderKey正常写不需要，这里是为了触发重新挂载渲染 */}
        <t-chat-item key={this.rerenderKey.value} {...this.itemProps} />
        <t-space direction="vertical">
          <div style={{ width: '100px' }}>插件配置</div>
          <t-space>
            代码块
            <t-switch size="large" value={this.hasCode.value} onChange={this.changeCodeHandler} />
          </t-space>
          <t-space>
            公式
            <t-switch size="large" value={this.hasKatex.value} onChange={this.changeKatexHandler} />
          </t-space>
        </t-space>
      </t-space>
    );
  }
}
