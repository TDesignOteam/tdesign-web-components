import 'tdesign-web-components/chat-action';
import 'tdesign-web-components/space';

import { Component } from 'omi';

const onActions = {
  replay: (data) => {
    console.log('自定义重新回复', data);
  },
  good: (data) => {
    console.log('点赞', data);
  },
  bad: (data) => {
    console.log('点踩', data);
  },
  share: (data) => {
    console.log('分享', data);
  },
  copy: (data) => {
    console.log('复制', data);
  },
};
export default class ChatAction extends Component {
  render() {
    return (
      <t-space>
        <t-chat-action comment="good" copyText="这是一段文字" onActions={onActions}></t-chat-action>
        <t-chat-action actionBar={['good', 'bad', 'replay']} onActions={onActions}></t-chat-action>
      </t-space>
    );
  }
}
