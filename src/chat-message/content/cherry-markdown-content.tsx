import Cherry from 'cherry-markdown/dist/cherry-markdown.core';
import type { CherryOptions } from 'cherry-markdown/types/cherry';
import { Component, createRef, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';

import styles from '../style/chat-content.less';

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

export interface TdChatMarkdownContentProps {
  content?: string;
  options?: Omit<CherryOptions, 'id' | 'el' | 'toolbars'>;
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
    // TODO: 现在是测效果，正式看下默认怎么配。
    options: {
      engine: {
        syntax: {
          table: {
            selfClosing: true,
          },
          codeBlock: {
            copyCode: true,
          },
        },
      },
    },
  };

  mdRef = createRef<HTMLElement>();

  // TODO: md对象看看是不是直接provider传进来，否则每个content都要构造一个
  md: Cherry | null = null;

  isMarkdownInit = signal(false);

  ready() {
    this.initMarkdown();
  }

  initMarkdown = async () => {
    const { options } = this.props;

    // this.mdId.value = `${Date.now()}`;
    this.isMarkdownInit.value = false;
    const md = new Cherry({
      ...options,
      el: this.mdRef.current,
      toolbars: {
        toolbar: false,
        toc: false,
        showToolbar: false,
      },
      editor: {
        defaultModel: 'previewOnly',
        keepDocumentScrollAfterInit: true,
      },
      autoScrollByHashAfterInit: true,
      previewer: {
        enablePreviewerBubble: false,
      },
    });

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
    return this.md?.setValue(markdown);
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
