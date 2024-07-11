import 'tdesign-web-components/popconfirm';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components';

import { Component } from 'omi';

export default class IconUsageExample extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-space>
          <t-popconfirm content={'普通事件通知类型偏向于确认'}>
            <t-button theme="primary">默认</t-button>
          </t-popconfirm>
          <t-popconfirm content={'事件通知类型偏向于提示'} theme={'warning'}>
            <t-button theme="warning">警告</t-button>
          </t-popconfirm>
          <t-popconfirm content={'事件通知类型偏向于高危提醒'} theme={'danger'}>
            <t-button theme="danger">危险</t-button>
          </t-popconfirm>
        </t-space>
        <t-space>
          <t-popconfirm
            content={'基础气泡确认框文案示意文字按钮'}
            icon={<t-icon name="camera-1" />}
            popupProps={{ placement: 'bottom' }}
          >
            <t-button theme="default" variant="outline">
              自定义图标（属性）
            </t-button>
          </t-popconfirm>
        </t-space>
      </t-space>
    );
  }
}
