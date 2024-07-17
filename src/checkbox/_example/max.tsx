import 'tdesign-web-components/checkbox';
import 'tdesign-web-components/space';

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
    value: '深圳',
    label: '深圳',
  },
];

export default class CheckboxExample extends Component {
  max = signal(2);

  city = signal([]);

  render() {
    return (
      <t-space direction="vertical">
        <div>最多可选:2</div>
        <div>选中值: {this.city.value.length ? this.city.value.join('、') : '无'}</div>

        <t-checkbox-group
          max={this.max.value}
          value={this.city.value}
          onChange={(value) => {
            this.city.value = value;
          }}
        >
          {options.map((item) => (
            <t-checkbox key={item.value} value={item.value}>
              {item.label}
            </t-checkbox>
          ))}
        </t-checkbox-group>
      </t-space>
    );
  }
}
