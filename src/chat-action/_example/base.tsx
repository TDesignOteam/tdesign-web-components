import 'tdesign-web-components/chat-action';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class ChatAction extends Component {
  onActions = {
    replay: (data, callback) => {
      console.log('自定义重新回复', data);
      callback?.();
    },
    good: (data) => {
      console.log('点赞', data);
    },
    bakd: (data) => {
      console.log('点踩', data);
    },
  }
  render() {
    return (
      <>
        <t-space>
            <t-chat-action actionBar={['copy', 'good', 'bad', 'replay']} onActions={this.onActions}></t-chat-action>
        </t-space>
      </>
    );
  }
}
