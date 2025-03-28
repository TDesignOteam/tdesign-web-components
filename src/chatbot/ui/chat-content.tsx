import '../../message';

import markdownIt from 'markdown-it';
import { Component, OmiProps, signal, tag } from 'omi';

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
        await import('./md/chat-md-code');
        const codeStyles = await import('../style/md/chat-md-code.less');
        ChatContent.css.push(codeStyles.default);

        codeHighlight = (code: string, lang: string) =>
          // 传参注意转义
          `<t-chat-md-code lang="${lang}" code="${md.utils.escapeHtml(code)}"></t-chat-md-code>`;
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
  };

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
    const textContent = this.getTextInfo() || '';
    return (
      <div className={`${baseClass}`}>
        <div className={`${baseClass}__markdown ${roleClass}`} unsafeHTML={{ html: textContent }}></div>
      </div>
    );
  }
}
