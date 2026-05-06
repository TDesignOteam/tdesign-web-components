import 'tdesign-web-components/popconfirm';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class ButtonExample extends Component {
  render() {
    return (
      <t-space>
        <t-popconfirm theme="default" content="您确定要提交吗" confirmBtn="确认提交" cancelBtn="我再想想">
          <t-button theme="default" variant="outline">
            按钮样式（属性-字符串）
          </t-button>
        </t-popconfirm>
        <t-popconfirm
          theme="default"
          content="您确定要提交吗"
          confirmBtn={
            <t-button theme="warning" size="small">
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
            按钮样式（TNode）
          </t-button>
        </t-popconfirm>
      </t-space>
    );
  }
}
