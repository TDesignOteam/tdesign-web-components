import { getClassPrefix } from '@tdesign/web-components-shared/_util/classname';
import { setExportparts } from '@tdesign/web-components-shared/_util/dom';
import MermaidPlugin from 'cherry-markdown/dist/addons/cherry-code-block-mermaid-plugin.esm.js';
import CherryStream from 'cherry-markdown/dist/cherry-markdown.stream.esm.js';
import { merge } from 'lodash-es';
import { Component, createRef, signal, tag } from 'omi';

import { AddPartHook } from '../md/utils';

import styles from '../style/chat-content.less';

// 从 CherryStream 类的构造函数参数推断类型
type CherryOptions = ConstructorParameters<typeof CherryStream>[0];

if ((window as any).mermaid) {
  // 使用类型断言以绕过本地包类型配置问题
  CherryStream?.usePlugin?.(MermaidPlugin, {
    mermaidCanvasAppendDom: document.body,
    mermaid: (window as any).mermaid,
    mermaidAPI: (window as any).mermaid,
  });
}

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

/** cherry-md中支持的代码块风格 */
type CherryCodeBlockTheme =
  | 'coy'
  | 'dark'
  | 'default'
  | 'funky'
  | 'okaidia'
  | 'one-dark'
  | 'one-light'
  | 'solarized-light'
  | 'twilight'
  | 'vs-dark'
  | 'vs-light';

export type TdChatContentMDPluginConfig =
  /** 预设插件配置 */
  TdChatContentMDPresetConfig;

export type TdChatContentMDOptions = Omit<CherryOptions, 'id' | 'el' | 'toolbars' | 'themeSettings'> & {
  themeSettings?: {
    codeBlockTheme?: 'light' | 'dark' | CherryCodeBlockTheme;
  };
};

export interface TdChatMarkdownContentProps {
  content?: string;
  options?: TdChatContentMDOptions;
}

@tag('t-chat-md-content')
export default class ChatCherryMDContent extends Component<TdChatMarkdownContentProps> {
  static css = [styles];

  static propTypes = {
    content: String,
    options: Object,
  };

  static defaultProps: Partial<TdChatMarkdownContentProps> = {
    options: {},
  };

  mdRef = createRef<HTMLElement>();

  md: CherryStream | null = null;

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
          wrap: false,
          lineNumber: false,
          copyCode: true,
          editCode: false,
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
      // 关闭会导致代码块按钮隐藏
      // enablePreviewerBubble: false,
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

    const md = new CherryStream({
      ...this.markdownOptions,
      themeSettings: {
        ...this.markdownOptions.themeSettings,
        // 兼容老版本light/dark风格
        codeBlockTheme: (() => {
          if (this.markdownOptions.themeSettings?.codeBlockTheme === 'dark') {
            return 'one-dark';
          }
          if (this.markdownOptions.themeSettings?.codeBlockTheme === 'light') {
            return 'one-light';
          }
          return this.markdownOptions.themeSettings?.codeBlockTheme || 'one-light';
        })(),
      },
      engine: {
        ...this.markdownOptions.engine,
        syntax: {
          ...this.markdownOptions.engine?.syntax,
        },
      },
      el: this.mdRef.current,
    });

    this.md = md;
    this.isMarkdownInit.value = true;
  };

  getTextInfo() {
    const { content } = this.props;
    if (typeof content !== 'string') return;
    // 这里给一个空格针对空内容占位，避免cherryMD复用旧数据
    this.parseMarkdown(content || ' ');
  }

  parseMarkdown(markdown: string) {
    if (!this.isMarkdownInit.value || !markdown) return '';
    this.md?.setMarkdown(markdown);
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
