import 'tdesign-icons-web-components/esm/components/file-copy';

import mk from '@vscode/markdown-it-katex';
import hljs from 'highlight.js';
import markdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';
import { Component, css, globalCSS, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import type { TdChatContentProps } from '../type';

import styles from '../style/chat-content.less';

globalCSS(css`
  ${styles}
`);

const baseClass = `${getClassPrefix()}-chat__text`;

// TODO: 图片
const md = markdownIt({
  html: true, // 允许HTML标签
  breaks: true, // 自动换行
  linkify: true, // 自动转换链接
  typographer: true, // 排版优化
  // 代码块
  highlight: (str: string, lang: string) => {
    let code = md.utils.escapeHtml(str);
    if (lang && hljs.getLanguage(lang)) {
      code = hljs.highlight(str, {
        language: lang,
        ignoreIllegals: true,
      }).value;
    }

    const codeClass = `${baseClass}__markdown__code`;
    const codeLang = `<span class="${`${codeClass}__header__lang`}">${lang}</span>`;
    const codeHeader = `<div class="${`${codeClass}__header`}">${codeLang}</div>`;
    const codeBodyClass = classname([`${codeClass}__body`, 'hljs']);
    const codeBody = `<div class="${codeBodyClass}"><code>${code}</code></div>`;

    return `<pre class="${codeClass}">${codeHeader}${codeBody}</pre>`;
  },
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
