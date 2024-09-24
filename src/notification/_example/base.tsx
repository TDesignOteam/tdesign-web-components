import 'tdesign-web-components/notification';

import { Component } from 'omi';

export default class BasicExample extends Component {
  render() {
    return <t-notification title="标题名称" content="这是一条消息通知" theme="info" />;
  }
}
