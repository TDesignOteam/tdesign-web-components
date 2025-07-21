import Cherry from 'cherry-markdown/dist/cherry-markdown.core';
import type { CherryOptions } from 'cherry-markdown/types/cherry';
import { merge } from 'lodash-es';
import { Component, createRef, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { setExportparts } from '../../_util/dom';

import styles from '../style/cherry-chat-content.less';

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
  static css = [styles];

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

  /** 传入cherryMarkdown的配置 */
  private markdownOptions: CherryOptions = {
    engine: {
      global: {
        flowSessionContext: true,
        // FIXME: 样式加不上，并且恢复数据时也会直接加上，不确定要不要加
        // flowSessionCursor: `<span class="${baseClass}__cursor" part="${baseClass}__cursor">cursor</span>`,
      },
      syntax: {
        fontEmphasis: {
          selfClosing: true,
        },
        table: {
          selfClosing: true,
        },
        link: {
          target: '_blank',
        },
        codeBlock: {
          copyCode: true,
        },
        mathBlock: {
          engine: 'MathJax',
          src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js',
          plugins: true,
        },
        inlineMath: {
          engine: 'MathJax',
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
      keepDocumentScrollAfterInit: true,
    },
    previewer: {
      enablePreviewerBubble: false,
    },
  };

  ready() {
    const { options } = this.props;
    console.log('查看传入options', options);
    this.markdownOptions = merge(this.markdownOptions, options);
    this.initMarkdown();
    setExportparts(this);
  }

  initMarkdown = async () => {
    this.isMarkdownInit.value = false;
    console.log('查看markdownOptions', this.markdownOptions);

    const md = new Cherry({
      ...this.markdownOptions,
      el: this.mdRef.current,
    });
    // md.clearFlowSessionCursor();

    // 筛选生效的预设插件

    // 筛选自定义插件

    // 注入预设插件
    // 代码块
    // 其他预设

    // 注入自定义插件
    // customPlugins.forEach((plugin) => {
    // md.use(plugin);
    // md.engine
    // });

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
