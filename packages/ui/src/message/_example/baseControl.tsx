import '@tdesign/web-components-ui/message';
import '@tdesign/web-components-ui/space';
import '@tdesign/web-components-ui/button';

import { MessagePlugin } from '@tdesign/web-components-ui';
import { Component, signal } from 'omi';

export default class MessageRender extends Component {
  instance = signal<any>(null);

  render() {
    const isMessageOpen = this.instance.value === null;
    const buttonTips = isMessageOpen ? '打开' : '关闭';
    return (
      <t-button
        onClick={() => {
          if (isMessageOpen) {
            const ins = MessagePlugin.info('调用关闭函数关闭信息提示框', 0);
            this.instance.value = ins;
          } else {
            MessagePlugin.close(this.instance.value);
            this.instance.value = null;
          }
        }}
      >
        自由控制关闭时机（{buttonTips}）
      </t-button>
    );
  }
}
