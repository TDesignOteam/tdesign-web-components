import 'tdesign-web-components/dialog';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components/esm/components/smile';

import { bind, Component, createRef, signal } from 'omi';

export default class Demo extends Component {
  visibleBody = signal(false);

  visibleFunction = signal(false);

  visibleApp = signal(false);

  visibleAttached = signal(false);

  demoRef = createRef();

  @bind
  handleClose() {
    this.visibleBody.value = false;
    this.visibleFunction.value = false;
    this.visibleApp.value = false;
    this.visibleAttached.value = false;
  }

  @bind
  getAttach() {
    const res = this.demoRef.current;
    return res;
  }

  render() {
    return (
      <div
        ref={this.demoRef}
        style={{ position: 'relative', height: '400px', zIndex: this.visibleAttached.value ? 1 : 'auto' }}
      >
        <t-space direction="horizontal" size="16px">
          <t-button theme="primary" onClick={() => (this.visibleBody.value = true)}>
            挂载在body
          </t-button>

          <t-button theme="primary" onClick={() => (this.visibleApp.value = true)}>
            挂载特定元素
          </t-button>

          <t-button theme="primary" onClick={() => (this.visibleFunction.value = true)}>
            挂载函数返回节点
          </t-button>

          <t-button theme="primary" onClick={() => (this.visibleAttached.value = true)}>
            展示在挂载元素区域
          </t-button>

          <t-dialog
            attach="body"
            header="挂载在body"
            cancelBtn={null}
            visible={this.visibleBody.value}
            onConfirm={this.handleClose}
            onClose={this.handleClose}
          >
            <p>This is a dialog</p>
          </t-dialog>
          <t-dialog
            attach="#app"
            header="挂载到id为app的元素"
            cancelBtn={null}
            visible={this.visibleApp.value}
            onConfirm={this.handleClose}
            onClose={this.handleClose}
          >
            <p>This is a dialog</p>
          </t-dialog>
          <t-dialog
            attach={this.getAttach}
            header="函数返回挂载节点"
            cancelBtn={null}
            visible={this.visibleFunction.value}
            onConfirm={this.handleClose}
            onClose={this.handleClose}
          >
            <p>This is a dialog</p>
          </t-dialog>

          <t-dialog
            attach={this.getAttach}
            header="展示在挂载元素区域"
            cancelBtn={null}
            showInAttachedElement
            visible={this.visibleAttached.value}
            onConfirm={this.handleClose}
            onClose={this.handleClose}
          >
            <p>
              父元素（挂载元素）需要有定位属性，如：position: relative showInAttachedElement API 仅针对模态对话框有效
            </p>
          </t-dialog>
        </t-space>
      </div>
    );
  }
}
