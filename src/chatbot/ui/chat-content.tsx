import '../../message';

import markdownIt from 'markdown-it';
import { Component, createRef, OmiProps, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import type { TdChatContentMDPluginConfig, TdChatContentMDPresetConfig, TdChatContentProps } from '../type';

import styles from '../style/chat-content.less';

const baseClass = `${getClassPrefix()}-chat__text`;

@tag('t-chat-content')
export default class ChatContent extends Component<TdChatContentProps> {
  static css = [styles];

  static propTypes = {
    content: String,
    role: String,
    markdownProps: Object,
  };

  static defaultProps = {
    // TODO: 现在是测效果，正式看下默认怎么配。
    markdownProps: {
      options: {
        html: true, // 允许HTML标签
        breaks: true, // 自动换行
        typographer: true, // 排版优化
      },
      pluginConfig: [
        {
          preset: 'code',
          enabled: true,
        },
        {
          preset: 'link',
          enabled: true,
          options: [
            {
              matcher(href) {
                return href.match(/^https?:\/\//);
              },
              attrs: {
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            },
          ],
        },
        {
          preset: 'katex',
          enabled: false,
        },
      ],
    },
  };

  // TODO: md对象看看是不是直接provider传进来，否则每个content都要构造一个
  md: markdownIt | null = null;

  isMarkdownInit = signal(false);

  private lastHTML = '';

  private appendLock = false;

  private markdownContainer = createRef<HTMLElement>();

  install() {
    this.initMarkdown();
  }

  // static isLightDOM = true;

  initMarkdown = async () => {
    const { markdownProps } = this.props;
    const { options, pluginConfig } = markdownProps || {};

    const md = markdownIt({
      ...options,
    })
      // 表格
      .use((md) => {
        md.renderer.rules.table_open = () => `<div class=${baseClass}__markdown__table__wrapper>\n<table>\n`;
        md.renderer.rules.table_close = () => '</table>\n</div>';
      });

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
    // 筛选自定义插件
    const customPlugins =
      (pluginConfig?.filter((item) => typeof item !== 'object') as Array<
        Exclude<TdChatContentMDPluginConfig, TdChatContentMDPresetConfig>
      >) || [];

    // 注入预设插件
    // 代码块
    if (!options?.highlight) {
      const codeHighlightConfig = enabledPresetPlugins.find((item) => item.preset === 'code');
      let codeHighlight;
      if (codeHighlightConfig) {
        codeHighlight = (code: string, lang: string) => {
          import('./md/chat-md-code');
          // 传参注意转义
          return `<t-chat-md-code lang="${lang}" code="${md.utils.escapeHtml(code)}"></t-chat-md-code>`;
        };
      }
      md.options.highlight = codeHighlight;
    }
    // 其他预设
    for await (const config of enabledPresetPlugins) {
      const { preset, options } = config;
      switch (preset) {
        // 链接
        case 'link': {
          const plugin = await import('markdown-it-link-attributes');
          md.use(plugin.default, options);
          break;
        }
        // 公式
        case 'katex': {
          const plugin = await import('@vscode/markdown-it-katex');
          md.use(plugin.default, options);
          break;
        }
      }
    }

    // 注入自定义插件
    customPlugins.forEach((plugin) => {
      md.use(plugin);
    });

    this.md = md;
    this.isMarkdownInit.value = true;
    const newHTML = this.getTextInfo() || '';
    this.processContentUpdate(newHTML);
  };

  // 生命周期 - 组件更新时处理内容变化
  updated() {
    const newHTML = this.getTextInfo() || '';
    this.processContentUpdate(newHTML);
  }

  // 处理内容更新（流式或全量）
  private processContentUpdate(newHTML: string) {
    if (!this.markdownContainer.current) return;

    // 避免重复渲染
    if (this.lastHTML.length === newHTML.length) return;
    // 初次渲染或内容重置时全量更新
    if (!this.lastHTML || !newHTML.startsWith(this.lastHTML)) {
      this.lastHTML = newHTML;
      this.markdownContainer.current.innerHTML = newHTML;
      return;
    }

    // 提取增量内容
    const diff = this.findAppendedContent(this.lastHTML, newHTML);
    if (diff) {
      this.appendPartialContent(diff);
      this.lastHTML = newHTML;
    }
  }

  private findAppendedContent(oldHTML: string, newHTML: string): string | null {
    return newHTML.startsWith(oldHTML) ? newHTML.slice(oldHTML.length) : null;
  }

  // 增量插入内容
  private appendPartialContent(partialHTML: string) {
    if (this.appendLock || !this.markdownContainer.current) return;

    this.appendLock = true;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = partialHTML;

    const fragment = document.createDocumentFragment();
    Array.from(tempDiv.childNodes).forEach((node) => {
      fragment.appendChild(node.cloneNode(true));
    });

    this.markdownContainer.current.appendChild(fragment);
    this.appendLock = false;
  }

  getTextInfo() {
    const { content } = this.props;
    if (typeof content !== 'string') return;
    return this.parseMarkdown(content);
  }

  parseMarkdown(markdown: string) {
    if (!this.isMarkdownInit.value || !markdown) return '<div class="waiting">...</div>';
    return this.md?.render(markdown);
  }

  render({ role }: OmiProps<TdChatContentProps>) {
    const roleClass = `${baseClass}--${role}`;

    return (
      <div className={`${baseClass}`}>
        <div className={`${baseClass}__markdown ${roleClass}`} ref={this.markdownContainer}></div>
      </div>
    );
  }
}
