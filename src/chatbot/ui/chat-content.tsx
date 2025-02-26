import markdownIt from 'markdown-it';
import { Component, OmiProps,tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import type { TdChatContentProps } from '../type';

const md = markdownIt({ html: true, breaks: true });
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
      return escape(content || '');
    }
    return this.parseMarkdown(content);
  }

  parseMarkdown(markdown: string) {
    if (!markdown) return '<div class="waiting"></div>';
    return md.render(markdown);
  }

  render({ role }: OmiProps<TdChatContentProps>) {
    const textContent = this.getTextInfo();
    const roleClass = `${baseClass}--${role}`;

    return role === 'user' ? (
      <div className={`${baseClass}__user`}>
        <pre>{textContent}</pre>
      </div>
    ) : (
      <div className={`${baseClass}__assistant`}>
        <div className={`${baseClass}__content ${roleClass}`}>{textContent}</div>
      </div>
    );
  }
}
