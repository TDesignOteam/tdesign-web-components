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
      <t-space direction="horizontal" size="16px">
        <t-button theme="primary" onClick={() => (this.visibleConfirm.value = true)}>
          只显示确认按钮
        </t-button>

        <t-button theme="primary" onClick={() => (this.visibleButtonContent.value = true)}>
          自定义按钮内容
        </t-button>

        <t-button theme="primary" onClick={() => (this.visibleFooter.value = true)}>
          自定义内容
        </t-button>

        <t-button theme="primary" onClick={() => (this.visibleHideHeader.value = true)}>
          隐藏标题
        </t-button>

        <t-dialog
          header="只显示确认按钮"
          cancelBtn={null}
          visible={this.visibleConfirm.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        >
          <p>This is a dialog</p>
        </t-dialog>
        <t-dialog
          header="自定义按钮内容"
          confirmBtn="去意已决"
          cancelBtn="我再想想"
          visible={this.visibleButtonContent.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        >
          <p>This is a dialog</p>
        </t-dialog>
        <t-dialog
          header="自定义footer"
          footer={
            <>
              <div style={{ display: 'inline-block', marginRight: 8 }}>自定义的footer </div>
              <t-button theme="primary" onClick={this.handleClose}>
                好吧
              </t-button>
            </>
          }
          visible={this.visibleFooter.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        >
          <p>This is a dialog</p>
        </t-dialog>
        <t-dialog
          header={null}
          cancelBtn={null}
          visible={this.visibleHideHeader.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        >
          <p>This is a dialog</p>
        </t-dialog>
      </t-space>
    );
  }
}
