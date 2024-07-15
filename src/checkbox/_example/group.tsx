import 'tdesign-web-components/checkbox';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component, signal } from 'omi';

const options = [
  {
    value: '北京',
    label: '北京',
  },
  {
    value: '上海',
    label: '上海',
  },
  {
    value: '广州',
    label: '广州',
  },
  {
    label: '全选',
    checkAll: true as const,
  },
];

export default class CheckboxExample extends Component {
  disabled = signal(false);

  city = signal(['北京']);

  setDisabled(value) {
    this.disabled.value = value;
  }

  setCity(value) {
    this.city.value = value;
  }

  render() {
    return (
      <t-space direction="vertical">
        <div>选中值: {this.city.value.join('、')}</div>
        <div>
          <t-checkbox
            label="禁用全部"
            checked={this.disabled.value}
            onChange={(value) => this.setDisabled(value)}
          ></t-checkbox>
        </div>

        <t-checkbox-group
          disabled={this.disabled.value}
          value={this.city.value}
          onChange={(value) => {
            this.setCity(value);
          }}
          options={options}
        />
      </t-space>
    );
  }
}
