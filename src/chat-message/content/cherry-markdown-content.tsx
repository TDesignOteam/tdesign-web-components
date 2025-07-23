import '../md/chat-md-code';
import 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';

import Cherry from '@cherry-markdown/cherry-markdown-dev/dist/cherry-markdown.core';
import type { CherryOptions } from '@cherry-markdown/cherry-markdown-dev/types/cherry';
import { merge } from 'lodash-es';
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';
import { Component, createRef, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { setExportparts } from '../../_util/dom';
import { AddPartHook } from '../md/utils';

import styles from '../style/cherry-chat-content.less';
// 单独用该组件时，发现动态加载样式不生效，目前直接引入
import codeStyles from '../style/md/chat-md-code.less';

const baseClass = `${getClassPrefix()}-chat__text`;

/** markdown插件预设 */
export type TdChatContentMDPresetPlugin = '';

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
/** cherryMarkdown原生插件配置 */

export type TdChatContentMDOptions = Omit<CherryOptions, 'id' | 'el' | 'toolbars'>;

export interface TdChatMarkdownContentProps {
  content?: string;
  options?: TdChatContentMDOptions;
  pluginConfig?: Array<TdChatContentMDPluginConfig>;
}

@tag('t-chat-cherry-md-content')
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

  private renderCode = (code, lang) => `<t-chat-md-code lang="${lang}" code="${escapeHtml(code)}"></t-chat-md-code>`;

  /** 传入cherryMarkdown的配置 */
  private markdownOptions: CherryOptions = {
    engine: {
      global: {
        flowSessionContext: true,
        // 恢复数据时也会直接加上光标
        // flowSessionCursor: `<span class="${baseClass}__cursor" part="${baseClass}__cursor">cursor</span>`,
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
        mathBlock: {
          engine: 'katex',
        },
        inlineMath: {
          engine: 'katex',
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
    this.isMarkdownInit.value = false;

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
