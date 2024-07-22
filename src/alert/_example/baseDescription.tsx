import 'tdesign-web-components/alert';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class Alert extends Component {
  render() {
    const operation = <span>相关操作</span>;
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-alert
          theme="info"
          title="这是一条普通的消息提示"
          message="这是一条普通的消息提示描述，这是一条普通的消息提示描述"
          operation={operation}
          close
        />
      </t-space>
    );
  }
}
