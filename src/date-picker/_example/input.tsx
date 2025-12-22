import 'tdesign-web-components/date-picker';

import { Component } from 'omi';

export default class DatePickerBaseDemo extends Component {
  state = {
    dateValue: '',
  };

  handleDateChange = (e: CustomEvent) => {
    this.state.dateValue = e.detail.value;
    this.update();
  };

  render() {
    return <t-date-picker allowInput clearable value={this.state.dateValue} onChange={this.handleDateChange} />;
  }
}
