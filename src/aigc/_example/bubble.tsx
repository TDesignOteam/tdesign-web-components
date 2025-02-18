import 'tdesign-web-components/aigc';

import { Component } from 'omi';

export default class BubbleExample extends Component {
  render() {
    return (
      <div>
        <t-chat-message
          content="我是消息111"
          placement="end"
          header={<span>插入的header</span>}
          footer={<span>插入的footer</span>}
        />
        <t-chat-bubble content="我是消息222"></t-chat-bubble>
      </div>
    );
  }
}
