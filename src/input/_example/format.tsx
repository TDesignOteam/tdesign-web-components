import 'tdesign-web-components/input';

import { Component } from 'omi';

export default class InputForMat extends Component {
  inputValue = '';

  render() {
    function format(val) {
      const reg = /(\d)(?=(?:\d{3})+$)/g;
      const str = val.replace(reg, '$1,');
      return str;
    }

    const inputStatus = isNaN(+this.inputValue) ? 'error' : '';
    const tips = inputStatus ? '请输入数字' : '';

    return (
      <t-input
        placeholder="请输入数字"
        value={this.inputValue}
        onChange={(value) => {
          this.inputValue = value;
        }}
        status={inputStatus}
        format={format}
        tips={tips}
      />
    );
  }
}
