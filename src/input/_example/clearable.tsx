import 'tdesign-web-components/input';

import { Component } from 'omi';

export default class InputExample extends Component {
  value = 'TDesign';

  onChange = (v) => {
    this.value = v;
  };

  render() {
    return (
      <t-input
        placeholder="请输入内容"
        value={this.value}
        clearable
        onChange={(value) => {
          this.onChange(value);
        }}
        onClear={() => {
          console.log('onClear');
        }}
      />
    );
  }
}
