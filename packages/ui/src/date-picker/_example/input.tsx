import 'tdesign-web-components/date-picker';

import { Component } from 'omi';

export default class DatePickerBaseDemo extends Component {
  state = {
    dateValue: '',
  };

  handleDateChange = (value: string) => {
    this.state.dateValue = value;
    this.update();
  };

  render() {
    return <t-date-picker allowInput clearable value={this.state.dateValue} onChange={this.handleDateChange} />;
  }
}
