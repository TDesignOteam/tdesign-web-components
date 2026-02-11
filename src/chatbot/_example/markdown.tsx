import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/space';
import 'tdesign-web-components/switch';
// 公式能力引入，参考cherryMarkdown示例
import 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';

// 自定义代码块示例引入
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { Component, signal } from 'omi';

import { TdChatMessageProps } from '../../chat-message/type';
import mdContent from '../mock/testMarkdown.md?raw';

// 注册常用语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);

/**
 * 自定义代码块渲染器
 * 使用 highlight.js 进行语法高亮，并内联 GitHub Light 主题样式
 */
const customCodeBlockRenderer = (code: string, _sign: string, _cherry: any, lang: string) => {
  // 使用 highlight.js 进行代码高亮
  let highlightedCode = code;
  try {
    if (lang && hljs.getLanguage(lang)) {
      highlightedCode = hljs.highlight(code, {
        language: lang,
        ignoreIllegals: true,
      }).value;
    } else {
      // 如果语言不支持，使用自动检测
      highlightedCode = hljs.highlightAuto(code).value;
    }
  } catch (e) {
    console.error('代码高亮失败:', e);
    // 降级处理：转义 HTML
    highlightedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 返回带有完整样式的代码块
  // 注意：由于在 Shadow DOM 中，我们需要内联所有样式
  return `
    <div class="custom-code-block" style="margin: 16px 0; border-radius: 12px; overflow: hidden; border: 1px solid #d0d7de; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">
      <div style="background: linear-gradient(to bottom, #f6f8fa, #f0f3f6); color: #24292f; padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #d0d7de; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #57606a;">${
          lang || 'text'
        }</span>
        <span style="font-size: 11px; color: #8c959f; font-weight: 400;">代码</span>
      </div>
      <pre style="margin: 0; background: #ffffff; overflow-x: auto;"><code class="hljs language-${lang}" style="display: block; padding: 20px; color: #24292f; background: #ffffff; font-size: 13px; line-height: 1.6; tab-size: 4;">${highlightedCode}</code></pre>
      <style>
        /* GitHub Light Theme - 内联样式 */
        .hljs { color: #24292f; background: #ffffff; }
        .hljs-comment, .hljs-quote { color: #6a737d; font-style: italic; }
        .hljs-doctag, .hljs-keyword, .hljs-formula { color: #d73a49; font-weight: 600; }
        .hljs-section, .hljs-name, .hljs-selector-tag, .hljs-deletion { color: #22863a; }
        .hljs-subst { color: #24292f; }
        .hljs-literal { color: #005cc5; }
        .hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-meta .hljs-string { color: #032f62; }
        .hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-type, .hljs-selector-class, .hljs-selector-attr, .hljs-selector-pseudo { color: #6f42c1; }
        .hljs-number { color: #005cc5; }
        .hljs-symbol, .hljs-bullet, .hljs-link, .hljs-meta, .hljs-selector-id, .hljs-title { color: #6f42c1; }
        .hljs-built_in, .hljs-title.class_, .hljs-class .hljs-title { color: #e36209; }
        .hljs-emphasis { font-style: italic; }
        .hljs-strong { font-weight: bold; }
        .hljs-link { text-decoration: underline; }
      </style>
    </div>
  `;
};

export default class MarkdownExample extends Component {
  static css = [
    `
      .space::part(md_h3) {
        color: red;
      }
      .space::part(t-chat__text__markdown__code__body) {
        background: black;
      }
    `,
  ];

  hasKatex = signal(false);

  isCustomCodeBlock = signal(false);

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
            themeSettings: {
              codeBlockTheme: 'light',
            },
            engine: {
              syntax: {
                ...(this.hasKatex.value
                  ? {
                      mathBlock: {
                        engine: 'katex',
                      },
                      inlineMath: {
                        engine: 'katex',
                      },
                    }
                  : {}),
                ...(this.isCustomCodeBlock.value
                  ? {
                      codeBlock: {
                        customRenderer: {
                          all: {
                            render: customCodeBlockRenderer,
                          },
                        },
                      },
                    }
                  : {
                      codeBlock: {
                        customBtns: [
                          {
                            html: '<div>自定义按钮</div>',
                            onClick: (event, code, lang) => {
                              console.log(`【${lang}】: ${code}`);
                            },
                          },
                        ],
                      },
                    }),
              },
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

  changeCodeBlockHandler = async (e) => {
    this.isCustomCodeBlock.value = e;
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
          <t-space>
            自定义代码块
            <t-switch size="large" value={this.isCustomCodeBlock.value} onChange={this.changeCodeBlockHandler} />
          </t-space>
        </t-space>
      </t-space>
    );
  }
}
