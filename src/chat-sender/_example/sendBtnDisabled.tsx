import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/switch';

import { bind, Component, signal } from 'omi';

export default class SendBtnDisabledExample extends Component {
  inputValue = signal('输入内容');

  disabled = signal<boolean>(false);

  @bind
  onSwitchChange(value: boolean) {
    this.disabled.value = value;
    this.update();
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <t-switch value={this.disabled.value} onChange={this.onSwitchChange} />
          <span>禁用发送按钮</span>
        </div>
        <t-chat-sender
          value={this.inputValue.value}
          placeholder="请输入内容"
          sendBtnDisabled={this.disabled.value}
          onChange={(e: CustomEvent) => {
            this.inputValue.value = e.detail;
          }}
          onSend={() => {
            this.inputValue.value = '';
          }}
        />
      </div>
    );
  }
}
