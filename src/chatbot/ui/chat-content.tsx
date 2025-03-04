import markdownIt from 'markdown-it';
import { Component, css, globalCSS, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import styles from '../style/chat-content.less?inline';
import type { TdChatContentProps } from '../type';

globalCSS(css`
  ${styles}
`);

const md = markdownIt({
  html: true, // 允许HTML标签
  breaks: true, // 自动换行
  linkify: true, // 自动转换链接
  typographer: true, // 排版优化
});

const baseClass = `${getClassPrefix()}-chat__text`;

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

  // TODO: 代码块、公式、表格、链接
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
