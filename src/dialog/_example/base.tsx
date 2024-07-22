import 'tdesign-web-components/dialog';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  visible = signal(false);

  @bind
  handleClick() {
    console.log('[handleClick]');
    if (this.visible.value) return;
    this.visible.value = true;
  }

  @bind
  handleClose(context) {
    console.log('close', context);
    this.visible.value = false;
  }

  @bind
  onConfirm(context) {
    console.log('点击了确认按钮', context);
    this.visible.value = false;
  }

  @bind
  onCancel(context) {
    console.log('点击了取消按钮', context);
  }

  @bind
  onClickCloseBtn(context) {
    console.log('点击了关闭按钮', context);
  }

  @bind
  onKeydownEsc(context) {
    console.log('按下了ESC', context);
  }

  @bind
  onClickOverlay(context) {
    console.log('点击了蒙层', context);
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
          confirmOnEnter
          onClose={this.handleClose}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          onEscKeydown={this.onKeydownEsc}
          onCloseBtnClick={this.onClickCloseBtn}
          onOverlayClick={this.onClickOverlay}
        >
          <p>This is a dialog</p>
        </t-dialog>
      </t-space>
    );
  }
}
