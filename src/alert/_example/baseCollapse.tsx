import 'tdesign-web-components/alert';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class Alert extends Component {
  render() {
    const message = [
      '1.这是一条普通的消息提示描述，',
      '2.这是一条普通的消息提示描述，',
      '3.这是一条普通的消息提示描述，',
      '4.这是一条普通的消息提示描述，',
      '5.这是一条普通的消息提示描述，',
    ];
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-alert message={message} maxLine={2} close />
      </t-space>
    );
  }
}
