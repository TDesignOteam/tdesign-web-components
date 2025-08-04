import '../md/chat-md-code';

import Cherry from '@cherry-markdown/cherry-markdown-dev/dist/cherry-markdown.core';
import type { CherryOptions } from '@cherry-markdown/cherry-markdown-dev/types/cherry';
import { escape, merge } from 'lodash-es';
import { Component, createRef, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { setExportparts } from '../../_util/dom';
import { AddPartHook } from '../md/utils';

import styles from '../style/chat-content.less';
// 单独用该组件时，发现动态加载样式不生效，目前直接引入
import codeStyles from '../style/md/chat-md-code.less';

const baseClass = `${getClassPrefix()}-chat__text`;

/** markdown插件预设 */
export type TdChatContentMDPresetPlugin = 'katex';

export interface TdChatContentMDPresetConfig {
  preset: TdChatContentMDPresetPlugin;
  /** 是否开启 */
  enabled?: boolean;
  /** 插件参数 */
  options?: any;
}

export type TdChatContentMDPluginConfig =
  /** 预设插件配置 */
  TdChatContentMDPresetConfig;

export type TdChatContentMDOptions = Omit<CherryOptions, 'id' | 'el' | 'toolbars'>;

export interface TdChatMarkdownContentProps {
  content?: string;
  options?: TdChatContentMDOptions;
  pluginConfig?: Array<TdChatContentMDPluginConfig>;
}

@tag('t-chat-md-content')
export default class ChatCherryMDContent extends Component<TdChatMarkdownContentProps> {
  static css = [styles, codeStyles];

  static propTypes = {
    content: String,
    options: Object,
    pluginConfig: Object,
  };

  static defaultProps: Partial<TdChatMarkdownContentProps> = {
    options: {},
  };

  mdRef = createRef<HTMLElement>();

  md: Cherry | null = null;

  isMarkdownInit = signal(false);

  private renderCode = (code, lang) => `<t-chat-md-code lang="${lang}" code="${escape(code)}"></t-chat-md-code>`;

  /** 传入cherryMarkdown的配置 */
  private markdownOptions: CherryOptions = {
    engine: {
      global: {
        flowSessionContext: true,
      },
      syntax: {
        table: {
          selfClosing: true,
        },
        link: {
          target: '_blank',
        },
        codeBlock: {
          customRenderer: {
            // 自定义语法渲染器
            all: {
              render: (code) =>
                // FIXME: 语言获取
                this.renderCode(code, 'python'),
            },
          },
        },
      },
      customSyntax: {
        AddPart: {
          syntaxClass: AddPartHook,
          before: 'frontMatter',
        },
      },
    },
    toolbars: {
      toolbar: false,
      toc: false,
      showToolbar: false,
    },
    editor: {
      defaultModel: 'previewOnly',
    },
    previewer: {
      enablePreviewerBubble: false,
    },
  };

  ready() {
    const { options } = this.props;
    this.markdownOptions = merge(this.markdownOptions, options);
    this.initMarkdown();
    setExportparts(this);
  }

  initMarkdown = async () => {
    const { pluginConfig } = this.props;
    this.isMarkdownInit.value = false;

    // 筛选生效的预设插件
    const enabledPresetPlugins =
      (pluginConfig?.filter((item) => {
        if (typeof item !== 'object') {
          return false;
        }
        if (typeof item.enabled === 'boolean' && !item.enabled) {
          return false;
        }
        return true;
      }) as TdChatContentMDPresetConfig[] | undefined) || [];

    // 注入预设插件 注意配置优先级用户自定义永远最高
    for await (const config of enabledPresetPlugins) {
      const { preset } = config;
      switch (preset) {
        // 公式
        case 'katex': {
          await import('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js');
          this.markdownOptions.engine.syntax.mathBlock = {
            engine: 'katex',
            ...this.markdownOptions.engine.syntax.mathBlock,
          };
          this.markdownOptions.engine.syntax.inlineMath = {
            engine: 'katex',
            ...this.markdownOptions.engine.syntax.inlineMath,
          };
          break;
        }
      }
    }

    const md = new Cherry({
      ...this.markdownOptions,
      el: this.mdRef.current,
    });
    // md.clearFlowSessionCursor();

    this.md = md;
    this.isMarkdownInit.value = true;
  };

  getTextInfo() {
    const { content } = this.props;
    if (typeof content !== 'string') return '';
    return this.parseMarkdown(content);
  }

  parseMarkdown(markdown: string) {
    if (!this.isMarkdownInit.value || !markdown) return '';
    return this.md?.setMarkdown(markdown);
  }

  render() {
    this.getTextInfo();

    return (
      <div className={`${baseClass}`}>
        <div ref={this.mdRef} className={`${baseClass}__markdown`}></div>
      </div>
    );
  }
}
