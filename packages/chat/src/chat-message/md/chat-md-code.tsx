import 'tdesign-icons-web-components/esm/components/file-copy';
import '@tdesign/web-components-ui/message';

import { MessagePlugin } from '@tdesign/web-components-ui/message';
import hljs from 'highlight.js/lib/core';
// 只导入常用语言包
import bash from 'highlight.js/lib/languages/bash';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import less from 'highlight.js/lib/languages/less';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { escape } from 'lodash-es';
import { Component, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import type { TdChatCodeProps } from '../../chatbot/type';

const className = `${getClassPrefix()}-chat__text__markdown__code`;

@tag('t-chat-md-code')
export default class ChatMDCode extends Component<TdChatCodeProps> {
  // lightDOM组件无法直接挂styleSheet，样式由chat-content加载
  static isLightDOM = true;

  static propTypes = {
    // cherryMarkdown会将dom自定义属性自动添加data-
    'data-lang': String,
    'data-code': String,
    'data-theme': String,
  };

  msgInstance = null;

  codeHTML = null;

  constructor() {
    super();
    // 注册语言包
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('python', python);
    hljs.registerLanguage('java', java);
    hljs.registerLanguage('cpp', cpp);
    hljs.registerLanguage('c++', cpp);
    hljs.registerLanguage('c', cpp);
    hljs.registerLanguage('csharp', csharp);
    hljs.registerLanguage('cs', csharp);
    hljs.registerLanguage('php', php);
    hljs.registerLanguage('ruby', ruby);
    hljs.registerLanguage('go', go);
    hljs.registerLanguage('rust', rust);
    hljs.registerLanguage('swift', swift);
    hljs.registerLanguage('kotlin', kotlin);
    hljs.registerLanguage('sql', sql);
    hljs.registerLanguage('shell', shell);
    hljs.registerLanguage('sh', shell);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('html', xml);
    hljs.registerLanguage('yaml', yaml);
    hljs.registerLanguage('yml', yaml);
    hljs.registerLanguage('markdown', markdown);
    hljs.registerLanguage('md', markdown);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('scss', scss);
    hljs.registerLanguage('less', less);
  }

  install(): void {
    const lang = this.props['data-lang'];
    const code = this.props['data-code'];
    // 解析代码HTML
    this.codeHTML = escape(code);
    if (lang && hljs.getLanguage(lang)) {
      this.codeHTML = hljs.highlight(code, {
        language: lang,
        ignoreIllegals: true,
      }).value;
    }
  }

  render() {
    const lang = this.props['data-lang'];
    const theme = this.props['data-theme'];

    return (
      <div class={classname(`${className}`, theme)}>
        <div class={`${`${className}__header`}`}>
          <span class={`${`${className}__header__lang`}`}>{lang}</span>
          {/* !事件直接放icon上会触发两次 */}
          <span class={`${`${className}__header__copy__wrapper`}`} onClick={this.clickCopyHandler}>
            <t-icon-file-copy class={`${`${className}__header__copy`}`}></t-icon-file-copy>
          </span>
        </div>
        <pre
          class={`${classname([`${className}__body`, 'hljs'])}`}
          part={`${className}__body`}
          innerHTML={`<code part="${className}__code">${this.codeHTML}</code>`}
        />
      </div>
    );
  }

  clickCopyHandler = () => {
    const code = this.props['data-code'] || '';
    const lang = this.props['data-lang'];

    // 派发事件到外层
    this.fire(
      'code_copy',
      { code, lang },
      {
        bubbles: true,
        composed: true,
      },
    );

    navigator.clipboard
      .writeText(code)
      .then(() => {
        this.msgInstance = MessagePlugin.success('复制成功');
      })
      .catch(() => {
        this.msgInstance = MessagePlugin.success('复制失败，请手动复制');
      });
  };
}
