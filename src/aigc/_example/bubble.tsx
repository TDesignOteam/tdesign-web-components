import 'tdesign-web-components/aigc';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class BubbleExample extends Component {
  botMessage = '点击刷新';

  timer = 0;

  reset = () => {
    const result = '测试打字机效果，我是一段文字，看看是不是正常刷新';
    this.botMessage = '';

    window.clearInterval(this.timer);
    let wordIdx = 0;
    this.timer = window.setInterval(() => {
      if (!result[wordIdx]) {
        window.clearInterval(this.timer);
        return;
      }
      console.log('result[wordIdx]', result[wordIdx]);
      this.botMessage += result[wordIdx];
      wordIdx += 1;
      this.update();
    }, 60);

    this.update();
  };

  render() {
    return (
      <div>
        <t-button onClick={this.reset}>刷新打字机</t-button>
        <t-chat-bubble
          content="我是消息111"
          placement="end"
          header={<span>插入的header</span>}
          footer={<span>插入的footer</span>}
        />
        <t-chat-bubble content={this.botMessage}></t-chat-bubble>
      </div>
    );
  }
}
