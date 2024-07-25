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
          checked={this.value1.value}
          onChange={(v) => {
            this.onChange1(v);
          }}
        >
          受控属性
        </t-checkbox>
        <t-checkbox defaultChecked={true}>非受控属性</t-checkbox>
      </t-space>
    );
  }
}
