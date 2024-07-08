import 'tdesign-web-components/input';

import { Component } from 'omi';

export default class InputClear extends Component {
  inputValue = 'Hello TDesign';

  render() {
    return (
      <t-input
        placeholder="请输入内容"
        value={this.inputValue}
        clearable
        onChange={(value) => {
          this.inputValue = value;
        }}
      />
    );
  }
}
