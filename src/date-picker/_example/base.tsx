import 'tdesign-web-components/date-picker';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class DatePickerBaseDemo extends Component {
  state = {
    dateValue: '',
    rangeValue: ['', ''],
  };

  handleDateChange = (value: string) => {
    this.state.dateValue = value;
    this.update();
  };

  handleRangeChange = (value: string[]) => {
    this.state.rangeValue = value;
    this.update();
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-date-picker value={this.state.dateValue} onChange={this.handleDateChange} />
        <t-date-range-picker value={this.state.rangeValue} onChange={this.handleRangeChange} />
      </t-space>
    );
  }
}
