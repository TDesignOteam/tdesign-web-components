import 'tdesign-web-components/input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputSize extends Component {
  inputValue = '';

  render() {
    return (
      <t-space direction="vertical" style={{ width: 500 }}>
        <t-input
          placeholder="请输入内容"
          value={this.inputValue}
          onChange={(value) => {
            this.inputValue = value;
            this.update();
          }}
          size="small"
        />
        <t-input
          placeholder="请输入内容"
          value={this.inputValue}
          onChange={(value) => {
            this.inputValue = value;
            this.update();
          }}
        />
        <t-input
          placeholder="请输入内容"
          value={this.inputValue}
          onChange={(value) => {
            this.inputValue = value;
            this.update();
          }}
          size="large"
        />
      </t-space>
    );
  }
}
