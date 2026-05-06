import 'tdesign-web-components/dialog';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  visible = signal(false);

  loading = signal(false);

  @bind
  handleClick() {
    if (this.visible.value) return;
    this.visible.value = true;
  }

  @bind
  handleClose() {
    this.visible.value = false;
  }

  @bind
  onConfirmAsync() {
    this.loading.value = true;
    setTimeout(() => {
      this.loading.value = false;
      this.visible.value = false;
    }, 2000);
  }

  render() {
    return (
      <t-space direction="vertical" size="60px" style={{ width: '100%' }}>
        <t-button theme="primary" onClick={this.handleClick}>
          Open Modal
        </t-button>

        <t-dialog
          header="Basic Modal"
          visible={this.visible.value}
          onClose={this.handleClose}
          onConfirm={this.onConfirmAsync}
          confirmLoading={this.loading.value}
        >
          <p>This is a dialog</p>
        </t-dialog>
      </t-space>
    );
  }
}
