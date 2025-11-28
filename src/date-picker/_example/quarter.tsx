import 'tdesign-web-components/date-picker';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class DatePickerQuarterDemo extends Component {
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
        <t-date-picker mode="quarter" value={this.state.value} onChange={this.handleChange} placeholder="请选择季度" />
        <t-date-range-picker
          mode="quarter"
          value={this.state.rangeValue}
          onChange={this.handleRangeChange}
          placeholder={['开始季度', '结束季度']}
        />
      </t-space>
    );
  }
}
