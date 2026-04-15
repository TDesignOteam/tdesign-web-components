import 'tdesign-web-components/space';

import { Component } from 'omi';
import { type RadioOption } from 'tdesign-web-components/radio';

const objOptions: RadioOption[] = [
  {
    value: 'bj',
    label: '北京',
  },
  {
    value: 'sh',
    label: '上海',
  },
  {
    value: 'gz',
    label: '广州',
    disabled: true,
  },
  {
    value: 'sz',
    label: '深圳',
  },
];

const itemOptions = ['北京', '上海', '广州', '深圳'];

type ValueType = '北京' | '上海' | '广州' | '深圳';
type FirstCityType = 'bj' | 'sh' | 'gz' | 'sz';

export default class GroupExample extends Component {
  private city: FirstCityType = 'bj';

  private city2: FirstCityType = 'sz';

  private city3: ValueType = '深圳';

  setCity = (v: FirstCityType) => {
    this.city = v;
    this.update();
  };

  setCity2 = (v: FirstCityType) => {
    this.city2 = v;
    this.update();
  };

  setCity3 = (v: ValueType) => {
    this.city3 = v;
    this.update();
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-radio-group value={this.city} onChange={this.setCity} allowUncheck>
          <t-radio value="bj" content="北京" />
          <t-radio value="sh" content="上海" />
          <t-radio value="gz" content="广州" />
          <t-radio value="sz" content="深圳" />
        </t-radio-group>

        <t-radio-group value={this.city2} options={objOptions} onChange={this.setCity2} allowUncheck />
        <t-radio-group variant="default-filled" value={this.city2} options={objOptions} onChange={this.setCity2} />

        <t-radio-group value={this.city3} options={itemOptions} onChange={this.setCity3} />
        <t-radio-group variant="primary-filled" value={this.city3} options={itemOptions} onChange={this.setCity3} />
      </t-space>
    );
  }
}
