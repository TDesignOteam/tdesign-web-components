import 'tdesign-web-components/notification';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';
import { NotificationPlugin } from 'tdesign-web-components/notification';

export default class ToggleExample extends Component {
  openNotification = () => {
    const notification = NotificationPlugin.info({
      title: '信息',
      content: '这是一条不会自动关闭的消息通知',
      closeBtn: true,
      duration: 0,
      onCloseBtnClick: () => {
        NotificationPlugin.close(notification);
      },
    });
  };

  render() {
    return <t-button onClick={this.openNotification}>自由控制关闭时机</t-button>;
  }
}
