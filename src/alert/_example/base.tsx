import 'tdesign-web-components/alert';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class Alert extends Component {
  render() {
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-alert theme="success" message="这是一条成功的消息提示" />
        <t-alert theme="info" message="这是一条普通的消息提示" />
        <t-alert theme="warning" message="这是一条警示消息提示" />
        <t-alert theme="error" message="高危操作/出错信息提示" />
      </t-space>
    );
  }
}
