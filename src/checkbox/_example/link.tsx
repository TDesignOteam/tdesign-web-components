import 'tdesign-web-components/checkbox';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component, signal } from 'omi';

export default class CheckboxExample extends Component {
  checked = signal(['选项二']);

  onChange(value) {
    this.checked.value = value;
  }

  render() {
    return (
      <t-space direction="vertical">
        <p>选中值: {this.checked.value.join('，')}</p>
        <t-checkbox-group
          onChange={(v) => this.onChange(v)}
          value={this.checked.value}
          options={['选项一', '选项二', '选项三']}
        ></t-checkbox-group>
        <t-button
          size="small"
          onClick={() => {
            this.checked.value = ['选项一'];
          }}
        >
          重置
        </t-button>
      </t-space>
    );
  }
}
