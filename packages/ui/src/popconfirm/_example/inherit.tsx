import 'tdesign-web-components/popconfirm';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class InheritExample extends Component {
  render() {
    return (
      <t-space>
        <t-popconfirm theme="default" content="直接使用 placement 进行设置" placement="bottom">
          <t-button theme="default" variant="outline">
            浮层出现在下方
          </t-button>
        </t-popconfirm>
        <t-popconfirm
          theme="default"
          content="透传属性到 Popup 组件进行设置"
          popupProps={{
            placement: 'right',
          }}
          confirmBtn={
            <t-button theme="primary" size="small">
              确定提交
            </t-button>
          }
          cancelBtn={
            <t-button theme="default" size="small" variant="outline">
              我再想想
            </t-button>
          }
        >
          <t-button theme="default" variant="outline">
            浮层出现在右侧
          </t-button>
        </t-popconfirm>
      </t-space>
    );
  }
}
