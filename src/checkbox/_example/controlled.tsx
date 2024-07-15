import 'tdesign-web-components/checkbox';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class CheckboxExample extends Component {
  value1 = signal(false);

  onChange1(value) {
    this.value1.value = value;
  }

  render() {
    return (
      <t-space>
        <t-checkbox
          label="受控属性"
          checked={this.value1.value}
          onChange={(v) => {
            this.onChange1(v);
          }}
        ></t-checkbox>
        <t-checkbox label="非受控属性" defaultChecked={true}></t-checkbox>
      </t-space>
    );
  }
}
