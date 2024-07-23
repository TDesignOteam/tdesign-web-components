import 'tdesign-web-components/dialog';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components/esm/components/smile';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  visibleCustom = signal(false);

  visibleConfirm = signal(false);

  visibleFooter = signal(false);

  visibleButtonContent = signal(false);

  visibleHideHeader = signal(false);

  @bind
  handleClose() {
    this.visibleConfirm.value = false;
    this.visibleFooter.value = false;
    this.visibleButtonContent.value = false;
    this.visibleHideHeader.value = false;
    this.visibleCustom.value = false;
  }

  render() {
    return (
      <div>
        <t-space direction="horizontal" size="16px">
          <t-button theme="primary" onClick={() => (this.visibleConfirm.value = true)}>
            模态对话框
          </t-button>

          <t-button theme="primary" onClick={() => (this.visibleButtonContent.value = true)}>
            非模态对话框
          </t-button>

          <t-button theme="primary" onClick={() => (this.visibleFooter.value = true)}>
            普通对话框
          </t-button>

          <t-dialog
            header="模态对话框"
            visible={this.visibleConfirm.value}
            onConfirm={this.handleClose}
            onClose={this.handleClose}
          >
            <p>This is a dialog</p>
          </t-dialog>

          <t-dialog
            header="非模态对话框"
            mode="modeless"
            visible={this.visibleButtonContent.value}
            onConfirm={this.handleClose}
            onClose={this.handleClose}
          >
            <p>This is a dialog</p>
          </t-dialog>
        </t-space>

        <t-dialog
          header="普通对话框"
          mode="normal"
          visible={this.visibleFooter.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        >
          <p>This is a dialog</p>
        </t-dialog>
      </div>
    );
  }
}
