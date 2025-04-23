import 'tdesign-web-components/chat-action';
import 'tdesign-web-components/space';
import { MessagePlugin } from 'tdesign-web-components/message';

import { Component } from 'omi';

const onActions = {
  replay: (data, callback) => {
    console.log('自定义重新回复', data);
    callback?.();
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
  copy: () => { 
    MessagePlugin.success('复制成功');
  }
}
export default class ChatAction extends Component {
  
  render() {
    return (
      <>
        <t-space>
            <t-chat-action actionBar={['replay', 'good', 'bad']} onActions={onActions}></t-chat-action>
            <t-chat-action></t-chat-action>
        </t-space>
      </>
    );
  }
}
