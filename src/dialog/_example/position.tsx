import 'tdesign-web-components/dialog';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components/esm/components/smile';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  visible = signal(false);

  visibleOverflow = signal(false);

  placement = signal('center');

  top = signal<string | number>('');

  @bind
  handleClose() {
    this.visibleOverflow.value = false;
    this.visible.value = false;
  }

  @bind
  handleClick(placement, top?: string | number) {
    this.visible.value = true;
    this.placement.value = placement;
    this.top.value = top || '';
  }

  render() {
    return (
      <t-space direction="horizontal" size="16px">
        <t-button theme="primary" onClick={() => this.handleClick('top')}>
          默认
        </t-button>

        <t-button theme="primary" onClick={() => this.handleClick('center')}>
          垂直居中
        </t-button>

        <t-button theme="primary" onClick={() => this.handleClick('top', 10)}>
          自定义
        </t-button>

        <t-button theme="primary" onClick={() => (this.visibleOverflow.value = true)}>
          超出屏幕
        </t-button>

        <t-dialog
          header="位置演示"
          placement={this.placement.value}
          top={this.top.value}
          visible={this.visible.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
        >
          <p>This is a dialog</p>
        </t-dialog>

        <t-dialog
          cancelBtn={null}
          visible={this.visibleOverflow.value}
          onConfirm={this.handleClose}
          onClose={this.handleClose}
          header="位置演示"
        >
          {Array.from({ length: 100 }).map((_, index) => (
            <p key={index}>This is a dialog</p>
          ))}
        </t-dialog>
      </t-space>
    );
  }
}
