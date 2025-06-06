import MarkdownIt from 'markdown-it';
import linkPlugin from 'markdown-it-link-attributes';
import { Component, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import markdownItCjFriendlyPlugin from '../md/markdownItCjkFriendly';

import styles from '../style/chat-content.less';
// 单独用该组件时，发现动态加载样式不生效，目前直接引入
import codeStyles from '../style/md/chat-md-code.less';

const baseClass = `${getClassPrefix()}-chat__text`;

/** markdown插件预设 */
export type TdChatContentMDPresetPlugin = 'code' | 'link' | 'katex';

export interface TdChatContentMDPresetConfig {
  preset: TdChatContentMDPresetPlugin;
  /** 是否开启 */
  enabled?: boolean;
  /** 插件参数 */
  options?: any;
}

export type TdChatContentMDPluginConfig =
  /** 预设插件配置 */
  | TdChatContentMDPresetConfig
  /** markdownIt原生插件配置 */
  | MarkdownIt.PluginSimple
  | MarkdownIt.PluginWithParams
  | MarkdownIt.PluginWithOptions;

export interface TdChatMarkdownContentProps {
  content?: string;
  options?: MarkdownIt.Options;
  pluginConfig?: Array<TdChatContentMDPluginConfig>;
}

@tag('t-chat-md-content')
export default class ChatMDContent extends Component<TdChatMarkdownContentProps> {
  static css = [styles, codeStyles];

  static propTypes = {
    content: String,
    options: Object,
    pluginConfig: Object,
  };

  static defaultProps = {
    // TODO: 现在是测效果，正式看下默认怎么配。
    options: {
      html: true, // 允许HTML标签
      breaks: true, // 自动换行
      typographer: true, // 排版优化
    },
    pluginConfig: [
      {
        preset: 'code',
        enabled: false,
      },
      {
        preset: 'katex',
        enabled: false,
      },
    ],
  };

  // TODO: md对象看看是不是直接provider传进来，否则每个content都要构造一个
  md: MarkdownIt | null = null;

  isMarkdownInit = signal(false);

  ready() {
    this.initMarkdown();
  }

  initMarkdown = async () => {
    const { options, pluginConfig } = this.props;

    this.isMarkdownInit.value = false;
    const md = MarkdownIt({
      ...options,
    })
      .use(markdownItCjFriendlyPlugin)
      // 表格
      .use((md) => {
        md.renderer.rules.table_open = () => `<div class=${baseClass}__markdown__table__wrapper>\n<table>\n`;
        md.renderer.rules.table_close = () => '</table>\n</div>';
      })
      .use(linkPlugin, {
        attrs: {
          target: '_blank',
          rel: 'noopener',
        },
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
    const codeHighlightConfig = enabledPresetPlugins.find((item) => item.preset === 'code');
    if (codeHighlightConfig) {
      await import('../md/chat-md-code');

      const codeHighlight = (code: string, lang: string, attrs: string) => {
        // 优先取用户自定义代码块渲染
        const customHighlight = options?.highlight?.(code, lang, attrs);
        if (customHighlight) {
          return customHighlight;
        }
        // 传参注意转义
        return `<t-chat-md-code lang="${lang}" code="${md.utils.escapeHtml(code)}"></t-chat-md-code>`;
      };
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
  };

  getTextInfo() {
    const { content } = this.props;
    if (typeof content !== 'string') return '';
    return this.parseMarkdown(content);
  }

  parseMarkdown(markdown: string) {
    if (!this.isMarkdownInit.value || !markdown) return '';
    return this.md?.render(markdown);
  }

  render() {
    const textContent = this.getTextInfo() || '';
    if (!textContent) return;
    return (
      <div className={`${baseClass}`}>
        <div className={`${baseClass}__markdown`} unsafeHTML={{ html: textContent }}></div>
      </div>
    );
  }
}
