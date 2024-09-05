import 'tdesign-web-components/notification';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class IconExample extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-notification
          theme="info"
          title="普通通知"
          content="这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知"
        />
        <t-notification
          theme="error"
          title="危险通知"
          content="这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知"
        />
        <t-notification
          theme="warning"
          title="告警通知"
          content="这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知"
        />
        <t-notification
          theme="success"
          title="成功通知"
          content="这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知"
        />
      </t-space>
    );
  }
}
