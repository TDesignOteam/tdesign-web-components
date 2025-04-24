import 'tdesign-web-components/chat-action';
import 'tdesign-web-components/space';

import { Component } from 'omi';

const onActions = (name, data) => {
  console.log('消息事件触发：', name, data);
};
export default class ChatAction extends Component {
  render() {
    return (
      <t-space>
        <t-chat-action comment="good" copyText="这是一段文字" handleAction={onActions}></t-chat-action>
        <t-chat-action actionBar={['good', 'bad', 'replay']} handleAction={onActions}></t-chat-action>
      </t-space>
    );
  }
}
