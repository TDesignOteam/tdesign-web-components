import 'tdesign-web-components/message';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';
import { MessagePlugin } from 'tdesign-web-components';

export default class MessageRender extends Component {
  render() {
    return (
      <t-space>
        <t-button
          onClick={() => {
            MessagePlugin.info('这是第一条消息');
            MessagePlugin.warning('这是第二条消息');
            MessagePlugin.error('这是第三条消息');
          }}
        >
          点击打开多个消息
        </t-button>
        <t-button
          onClick={() => {
            MessagePlugin.closeAll();
          }}
        >
          点击关闭所有消息
        </t-button>
      </t-space>
    );
  }
}
