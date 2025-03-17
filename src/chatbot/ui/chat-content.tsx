import '../../message';

import markdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';
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
        linkify: true, // 自动转换链接
        typographer: true, // 排版优化
      },
      pluginConfig: [
        {
          preset: 'code',
          enabled: true,
        },
        {
          preset: 'katex',
          enabled: true,
        },
      ],
    },
  };

  // TODO: md对象看看是不是直接provider传进来，否则每个content都要构造一个
  md = null;

  isMarkdownInit = signal(false);

  install() {
    this.initMarkdown();
  }

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
      })
      // 链接
      .use(mila, [
        {
          matcher(href) {
            return href.match(/^https?:\/\//);
          },
          attrs: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        },
      ]);

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
        // 公式
        case 'katex': {
          const plugin = await import('@vscode/markdown-it-katex');
          md.use(plugin.default, options);
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
    return this.md.render(markdown);
  }

  render({ role }: OmiProps<TdChatContentProps>) {
    const textContent = this.getTextInfo();
    const roleClass = `${baseClass}--${role}`;

    return (
      <div className={`${baseClass}`}>
        <div className={`${baseClass}__markdown ${roleClass}`} innerHTML={textContent}></div>
      </div>
    );
  }
}
