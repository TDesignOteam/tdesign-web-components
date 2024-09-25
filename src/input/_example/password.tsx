import 'tdesign-icons-web-components/esm/components/lock-on';
import 'tdesign-web-components/input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputBase extends Component {
  value1 = '';

  value2 = 'Welcome to TDesign';

  render() {
    return (
      <t-space direction="vertical">
        <t-input
          value={this.value1}
          placeholder="请输入密码"
          type="password"
          prefixIcon={<t-icon-lock-on />}
          onChange={(value) => {
            this.value1 = value;
            this.update();
          }}
        />
        <t-input
          value={this.value2}
          placeholder="请输入密码"
          type="password"
          prefixIcon={<t-icon-lock-on />}
          onChange={(value) => {
            this.value2 = value;
            this.update();
          }}
        />
      </t-space>
    );
  }
}
