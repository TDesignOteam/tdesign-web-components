import 'tdesign-web-components/date-picker';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class DatePickerWeekDemo extends Component {
  state = {
    value: '',
    rangeValue: ['', ''],
  };

  handleChange = (e: CustomEvent) => {
    this.state.value = e.detail.value;
    this.update();
  };

  handleRangeChange = (e: CustomEvent) => {
    this.state.rangeValue = e.detail.value;
    this.update();
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-date-picker mode="week" value={this.state.value} onChange={this.handleChange} placeholder="请选择周" />
        <t-date-range-picker
          mode="week"
          value={this.state.rangeValue}
          onChange={this.handleRangeChange}
          placeholder={['开始周', '结束周']}
        />
      </t-space>
    );
  }
}
