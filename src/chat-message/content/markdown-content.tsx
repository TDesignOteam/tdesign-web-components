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
}

@tag('t-chat-md-content')
export default class ChatCherryMDContent extends Component<TdChatMarkdownContentProps> {
  static css = [styles, codeStyles];

  static propTypes = {
    content: String,
    options: Object,
  };

  static defaultProps: Partial<TdChatMarkdownContentProps> = {
    options: {},
  };

  mdRef = createRef<HTMLElement>();

  md: Cherry | null = null;

  isMarkdownInit = signal(false);

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
              render: (code, _sign, _cherry, lang) => `<t-chat-md-code lang="${lang}" code="${escape(code)}" />`,
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
    this.isMarkdownInit.value = false;

    const md = new Cherry({
      ...this.markdownOptions,
      el: this.mdRef.current,
    });

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
