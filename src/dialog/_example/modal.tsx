import 'tdesign-web-components/dialog';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components/esm/components/smile';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  visible = signal(false);

  visible1 = signal(false);

  visible2 = signal(false);

  @bind
  handleClose() {
    this.visible.value = false;
  }

  render() {
    return (
      <div>
        <t-space direction="horizontal" size="16px">
          <t-button theme="primary" onClick={() => (this.visible.value = true)}>
            模态对话框
          </t-button>

          <t-button theme="primary" onClick={() => (this.visible1.value = true)}>
            非模态对话框
          </t-button>

          <t-button theme="primary" onClick={() => (this.visible2.value = true)}>
            非模态对话框2
          </t-button>

          <t-dialog
            header="模态对话框"
            visible={this.visible.value}
            onConfirm={this.handleClose}
            onClose={this.handleClose}
          >
            <p>This is a dialog</p>
          </t-dialog>

          <t-dialog
            header="非模态对话框"
            mode="modeless"
            visible={this.visible1.value}
            onConfirm={() => (this.visible1.value = false)}
            onClose={() => (this.visible1.value = false)}
          >
            <p>非模态对话框</p>
          </t-dialog>

          <t-dialog
            header="非模态对话框2"
            mode="modeless"
            visible={this.visible2.value}
            onConfirm={() => (this.visible2.value = false)}
            onClose={() => (this.visible2.value = false)}
          >
            <p>非模态对话框2</p>
          </t-dialog>
        </t-space>

        <t-dialog header="普通对话框" mode="normal" visible={true} zIndex={1}>
          <p>This is a dialog</p>
        </t-dialog>
      </div>
    );
  }
}
