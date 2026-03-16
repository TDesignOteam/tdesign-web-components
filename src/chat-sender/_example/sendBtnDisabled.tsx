import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/switch';
import 'tdesign-web-components/tabs';

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
      <t-tabs defaultValue={1}>
        <t-tab-panel value={1} label="布尔值控制">
          <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        </t-tab-panel>

        <t-tab-panel value={2} label="函数控制-长度判断">
          <div style={{ padding: '16px 0' }}>
            <t-chat-sender
              placeholder="请输入至少5个字符"
              sendBtnDisabled={(value: string) => !value || value.length < 5}
              onSend={(e: CustomEvent) => {
                console.log('发送内容：', e.detail.value);
              }}
            />
          </div>
        </t-tab-panel>

        <t-tab-panel value={3} label="函数控制-格式验证">
          <div style={{ padding: '16px 0' }}>
            <div>必须包含@</div>
            <t-chat-sender
              placeholder="请输入邮箱地址"
              sendBtnDisabled={(value: string) => !value || !value.includes('@')}
              onSend={(e: CustomEvent) => {
                console.log('发送邮箱：', e.detail.value);
              }}
            />
          </div>
        </t-tab-panel>
      </t-tabs>
    );
  }
}
