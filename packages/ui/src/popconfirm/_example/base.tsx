import 'tdesign-web-components/popconfirm';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class BasicExample extends Component {
  visible = false;

  // TODO: Msg调用
  commitHandler = () => {
    // const msg = MessagePlugin.info('提交中', 0);
    setTimeout(() => {
      // MessagePlugin.close(msg);
      // MessagePlugin.success('提交成功！');
      this.visible = false;
      this.update();
    }, 1000);
  };

  render() {
    return (
      <t-space>
        <t-popconfirm content={'确认删除订单吗'} cancelBtn={null}>
          <t-button theme="primary">删除订单</t-button>
        </t-popconfirm>
        <t-popconfirm
          visible={this.visible}
          content={'是否提交审核？（自由控制浮层显示或隐藏）'}
          confirmBtn={
            <t-button size={'small'} onClick={this.commitHandler}>
              确定
            </t-button>
          }
          onCancel={() => {
            this.visible = false;
            this.update();
          }}
        >
          <t-button
            theme="primary"
            onClick={() => {
              this.visible = true;
              this.update();
            }}
          >
            提交审核
          </t-button>
        </t-popconfirm>
      </t-space>
    );
  }
}
