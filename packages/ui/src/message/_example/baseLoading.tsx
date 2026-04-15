import 'tdesign-web-components/message';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component, signal } from 'omi';

export default class MessageRender extends Component {
  successLoading = signal(false);

  warningLoading = signal(false);

  render() {
    const resetDisabled = this.successLoading.value || this.warningLoading.value;

    const resetMethod = () => {
      if (!this.successLoading.value && !this.warningLoading.value) {
        this.successLoading.value = true;
        this.warningLoading.value = true;
        setTimeout(() => {
          this.successLoading.value = false;
          this.warningLoading.value = false;
        }, 10000);
      }
    };
    return (
      <t-space direction="vertical">
        <t-message duration={0} theme="loading">
          用于表示操作正在生效的过程中
        </t-message>
        <t-message duration={0} theme={this.successLoading.value ? 'loading' : 'success'}>
          用于表示操作顺利达成(10s)
        </t-message>
        <t-message duration={0} theme={this.warningLoading.value ? 'loading' : 'warning'}>
          用于表示普通操作失败中断(10s)
        </t-message>
        <t-button style={{ marginTop: 16 }} onClick={resetMethod} disabled={resetDisabled}>
          重置
        </t-button>
      </t-space>
    );
  }
}
