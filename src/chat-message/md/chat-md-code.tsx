import 'tdesign-icons-web-components/esm/components/file-copy';
import '../../message';

import hljs from 'highlight.js';
import { escape } from 'lodash-es';
import { Component, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import type { TdChatCodeProps } from '../../chatbot/type';
import { MessagePlugin } from '../../message';

const className = `${getClassPrefix()}-chat__text__markdown__code`;

@tag('t-chat-md-code')
export default class ChatMDCode extends Component<TdChatCodeProps> {
  // lightDOM组件无法直接挂styleSheet，样式由chat-content加载
  static isLightDOM = true;

  static propTypes = {
    lang: String,
    code: String,
  };

  msgInstance = null;

  codeHTML = null;

  install(): void {
    const { lang, code } = this.props;
    // 解析代码HTML
    this.codeHTML = escape(code);
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
      <div class={`${className}`}>
        <div class={`${`${className}__header`}`}>
          <span class={`${`${className}__header__lang`}`}>{lang}</span>
          {/* !事件直接放icon上会触发两次 */}
          <span class={`${`${className}__header__copy__wrapper`}`} onClick={this.clickCopyHandler}>
            <t-icon-file-copy class={`${`${className}__header__copy`}`}></t-icon-file-copy>
          </span>
        </div>
        <pre class={`${classname([`${className}__body`, 'hljs'])}`} innerHTML={`<code>${this.codeHTML}</code>`} />
      </div>
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
