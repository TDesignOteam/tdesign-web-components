import '@tdesign/web-components-chat/chat-loading';
import '@tdesign/web-components/space';

import { Component } from 'omi';

export default class ChatLoading extends Component {
  render() {
    return (
      <>
        <t-space size={60}>
          <t-chat-loading animation="moving" text={'思考中...'}></t-chat-loading>
        </t-space>
      </>
    );
  }
}
