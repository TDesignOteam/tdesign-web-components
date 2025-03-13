import '../../message';
import './md/chat-md-code';

import mk from '@vscode/markdown-it-katex';
import markdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';
import { Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import type { TdChatContentProps } from '../type';

import styles from '../style/chat-content.less';

const baseClass = `${getClassPrefix()}-chat__text`;

const md = markdownIt({
  html: true, // 允许HTML标签
  breaks: true, // 自动换行
  linkify: true, // 自动转换链接
  typographer: true, // 排版优化
  // 代码块
  highlight: (code: string, lang: string) =>
    // 传参注意转义
    `<t-chat-md-code lang="${lang}" code="${md.utils.escapeHtml(code)}"></t-chat-md-code>`,
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
  ])
  // 公式
  .use(mk);

@tag('t-chat-content')
export default class ChatContent extends Component<TdChatContentProps> {
  static css = [styles];

  static propTypes = {
    content: String || Object,
    role: String,
  };

  getTextInfo() {
    const { content } = this.props;
    return this.parseMarkdown(content as string);
  }

  parseMarkdown(markdown: string) {
    if (!markdown) return '<div class="waiting">...</div>';
    return md.render(markdown);
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
