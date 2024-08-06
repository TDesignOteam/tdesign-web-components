import 'tdesign-web-components/input';

import { Component } from 'omi';

export default class InputClear extends Component {
  value = '';

  render() {
    return (
      <div>
        <t-input
          placeholder="请输入内容"
          value={this.value}
          clearable
          onChange={(value) => {
            this.value = value;
          }}
          onClear={() => {
            console.log('onClear');
          }}
        />
      </div>
    );
  }
}
