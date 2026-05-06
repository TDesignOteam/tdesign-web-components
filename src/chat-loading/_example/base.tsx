import 'tdesign-web-components/chat-loading';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class ChatLoading extends Component {
  render() {
    return (
      <>
        <t-space>
          <div style={{ width: 800, height: 150 }}>
            <t-chat-loading animation="skeleton"></t-chat-loading>
          </div>
        </t-space>
        <t-space size={60}>
          <t-chat-loading animation="moving"></t-chat-loading>
          <t-chat-loading animation="gradient"></t-chat-loading>
          <t-chat-loading animation="circle"></t-chat-loading>
          <t-chat-loading animation="dots"></t-chat-loading>
          <t-chat-loading animation="moving" text={'加载中...'}></t-chat-loading>
        </t-space>
      </>
    );
  }
}
