import 'tdesign-web-components/popconfirm';
import 'tdesign-web-components/button';
import 'tdesign-web-components/message';

import { Component, signal } from 'omi';
import { MessagePlugin } from 'tdesign-web-components/message/message.tsx';

export default class BasicExample extends Component {
  visible = signal(false);

  commitHandler = () => {
    const msg = MessagePlugin.info('提交中', 0);
    setTimeout(() => {
      MessagePlugin.close(msg);
      MessagePlugin.success('提交成功！');
      this.visible.value = false;
    }, 1000);
  };

  render() {
    return (
      <div style={{ display: 'flex', gap: '16px' }}>
        <t-popconfirm content={'确认删除订单吗'} cancelBtn={null}>
          <t-button theme="primary">删除订单</t-button>
        </t-popconfirm>
        <t-popconfirm
          visible={this.visible.value}
          content="是否提交审核？（自由控制浮层显示或隐藏）"
          confirmBtn={
            <t-button size={'small'} onClick={this.commitHandler}>
              确定
            </t-button>
          }
          onCancel={() => {
            this.visible.value = false;
          }}
        >
          <t-button
            theme="primary"
            onClick={() => {
              this.visible.value = true;
            }}
          >
            提交审核
          </t-button>
        </t-popconfirm>
      </div>
    );
  }
}
