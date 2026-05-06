import 'tdesign-web-components/message';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class MessageRender extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-message duration={0} theme="info">
          用户表示普通操作信息提示
        </t-message>
        <t-message duration={0} theme="success">
          用户表示操作引起一定后果
        </t-message>
        <t-message duration={0} theme="warning">
          用于表示操作顺利达成
        </t-message>
        <t-message duration={0} theme="error">
          用于表示操作引起严重的后果
        </t-message>
        <t-message duration={0} theme="question">
          用于帮助用户操作的信息提示
        </t-message>
      </t-space>
    );
  }
}
