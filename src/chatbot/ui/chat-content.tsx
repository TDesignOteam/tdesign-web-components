import mk from '@vscode/markdown-it-katex';
import markdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';
import { Component, css, globalCSS, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import styles from '../style/chat-content.less?inline';
import type { TdChatContentProps } from '../type';

globalCSS(css`
  ${styles}
`);

const baseClass = `${getClassPrefix()}-chat__text`;

// TODO: 代码块、图片
const md = markdownIt({
  html: true, // 允许HTML标签
  breaks: true, // 自动换行
  linkify: true, // 自动转换链接
  typographer: true, // 排版优化
})
  .use((md) => {
    // 表格
    md.renderer.rules.table_open = () => `<div class=${baseClass}__markdown__table--wrapper>\n<table>\n`;
    md.renderer.rules.table_close = () => '</table>\n</div>';
  })
  .use(mila, [
    // 外链
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
  static propTypes = {
    content: String,
    role: String,
    isNormalText: Boolean,
    textLoading: Boolean,
  };

  getTextInfo() {
    const { content, role } = this.props;
    if (role === 'user') {
      return content;
    }
    return this.parseMarkdown(content);
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
        {role === 'user' ? (
          <div className={`${baseClass}__user`}>{textContent}</div>
        ) : (
          <div className={`${baseClass}__assistant`}>
            <div className={`${baseClass}__markdown ${roleClass}`} innerHTML={textContent}></div>
          </div>
        )}
      </div>
    );
  }
}
