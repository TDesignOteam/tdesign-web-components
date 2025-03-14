import 'tdesign-icons-web-components/esm/components/file-copy';
import 'highlight.js/styles/atom-one-light.min.css';
import '../../../message';

import hljs from 'highlight.js';
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';
import { Component, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../../../_util/classname';
import { MessagePlugin } from '../../../message';
import type { TdChatCodeProps } from '../../type';

import styles from './chat-md-code.less';

const className = `${getClassPrefix()}-chat__text__markdown__code`;

@tag('t-chat-md-code')
export default class ChatMDCode extends Component<TdChatCodeProps> {
  static css = [styles];

  static propTypes = {
    lang: String,
    code: String,
  };

  msgInstance = null;

  codeHTML = null;

  install(): void {
    const { lang, code } = this.props;
    // 解析代码HTML
    this.codeHTML = escapeHtml(code);
    if (lang && hljs.getLanguage(lang)) {
      this.codeHTML = hljs.highlight(code, {
        language: lang,
        ignoreIllegals: true,
      }).value;
    }
  }

  render(props: OmiProps<TdChatCodeProps>) {
    const { lang } = props;

    return (
      <pre class={`${className}`}>
        <div class={`${`${className}__header`}`}>
          <span class={`${`${className}__header__lang`}`}>{lang}</span>
          {/* !事件直接放icon上会触发两次 */}
          <span class={`${`${className}__header__copy__wrapper`}`} onClick={this.clickCopyHandler}>
            <t-icon-file-copy class={`${`${className}__header__copy`}`}></t-icon-file-copy>
          </span>
        </div>
        <div class={`${classname([`${className}__body`, 'hljs'])}`} innerHTML={`<code>${this.codeHTML}</code>`} />
      </pre>
    );
  }

  clickCopyHandler = () => {
    navigator.clipboard
      .writeText(this.props.code || '')
      .then(() => {
        this.msgInstance = MessagePlugin.success('复制成功');
      })
      .catch(() => {
        this.msgInstance = MessagePlugin.success('复制失败，请手动复制');
      });
  };
}
