import 'tdesign-web-components/input';
import 'tdesign-web-components/space';
import 'tdesign-icons-web-components/esm/components/lock-on';
import 'tdesign-icons-web-components/esm/components/browse';

import { Component } from 'omi';

export default class InputPassword extends Component {
  value1 = '';

  value2 = '';

  render() {
    return (
      <div>
        <t-space direction="vertical">
          <t-input
            placeholder="请输入密码"
            value={this.value1}
            prefixIcon={<t-icon-lock-on />}
            type="password"
            onChange={(value) => {
              this.value1 = value;
            }}
          />
          <t-input
            placeholder="请输入密码"
            value={this.value2}
            prefixIcon={<t-icon-lock-on />}
            type="password"
            onChange={(value) => {
              this.value2 = value;
            }}
          />
        </t-space>
      </div>
    );
  }
}
