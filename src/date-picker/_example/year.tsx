import 'tdesign-web-components/date-picker';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class DatePickerYearDemo extends Component {
  state = {
    value: '',
    rangeValue: ['', ''],
  };

  handleChange = (value: string) => {
    this.state.value = value;
    this.update();
  };

  handleRangeChange = (value: string[]) => {
    this.state.rangeValue = value;
    this.update();
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-date-picker mode="year" value={this.state.value} onChange={this.handleChange} placeholder="请选择年份" />
        <t-date-range-picker
          mode="year"
          value={this.state.rangeValue}
          onChange={this.handleRangeChange}
          placeholder={['开始年份', '结束年份']}
        />
      </t-space>
    );
  }
}
