// import "tdesign-icons-omi/browse-off";
// import "tdesign-icons-omi/lock-on";
import 'tdesign-web-components/icon';
import 'tdesign-web-components/input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputPassword extends Component {
  inputValue = '';

  render() {
    return (
      <t-space direction="vertical">
        <t-input
          prefixIcon={<t-icon name={'lock-on'} />}
          suffixIcon={<t-icon name={'browse-off'} />}
          placeholder="请输入"
          value={this.inputValue}
          type="password"
          onChange={(value) => {
            this.inputValue = value;
            console.log(value);
            this.update();
          }}
        />
        <t-input
          prefixIcon={<t-icon name={'lock-on'} />}
          suffixIcon={<t-icon name={'browse-off'} />}
          placeholder="请输入"
          value={this.inputValue}
          type="password"
          onChange={(value) => {
            this.inputValue = value;
            this.update();
          }}
        />
      </t-space>
    );
  }
}
