import 'tdesign-web-components/dialog';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components/esm/components/smile';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  visibleCustom = signal(false);

  visibleConfirm = signal(false);

  visibleWarning = signal(false);

  visibleSuccess = signal(false);

  visibleDanger = signal(false);

  @bind
  handleClose() {
    this.visibleConfirm.value = false;
    this.visibleWarning.value = false;
    this.visibleSuccess.value = false;
    this.visibleDanger.value = false;
    this.visibleCustom.value = false;
  }

  render() {
    return (
      <t-space direction="horizontal" size="16px">
        <t-button theme="primary" onClick={() => (this.visibleConfirm.value = true)}>
          提示反馈
        </t-button>

        <t-button theme="primary" onClick={() => (this.visibleSuccess.value = true)}>
          成功反馈
        </t-button>

        <t-button theme="primary" onClick={() => (this.visibleWarning.value = true)}>
          警示反馈
        </t-button>

        <t-button theme="primary" onClick={() => (this.visibleDanger.value = true)}>
          错误反馈
        </t-button>

        <t-button theme="primary" onClick={() => (this.visibleCustom.value = true)}>
          自定义图标
        </t-button>

        <t-dialog
          header="提示"
          theme="info"
          cancelBtn={null}
          visible={this.visibleConfirm.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        />

        <t-dialog
          header="成功"
          theme="success"
          cancelBtn={null}
          visible={this.visibleSuccess.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        />

        <t-dialog
          header="警示"
          theme="warning"
          cancelBtn={null}
          visible={this.visibleWarning.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        />

        <t-dialog
          header="错误"
          theme="danger"
          cancelBtn={null}
          visible={this.visibleDanger.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        />

        <t-dialog
          cancelBtn={null}
          visible={this.visibleCustom.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
          header={
            <div slot="header">
              <t-icon-smile color="orange" style={{ marginRight: '4px', fontSize: '24px' }} />
              <span style="vertical-align: middle">对话框标题</span>
            </div>
          }
        />
      </t-space>
    );
  }
}
