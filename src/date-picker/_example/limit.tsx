import 'tdesign-web-components/date-picker';
import 'tdesign-web-components/space';

import dayjs from 'dayjs';
import { Component } from 'omi';

const minDate = dayjs().subtract(7, 'day');
const maxDate = dayjs().add(14, 'day');

const disableDate = (value: string | number | Date) => {
  const current = dayjs(value);
  if (!current.isValid()) return false;
  const outOfRange = current.isBefore(minDate, 'day') || current.isAfter(maxDate, 'day');
  const isWeekend = current.day() === 0 || current.day() === 6;
  return outOfRange || isWeekend;
};

export default class DatePickerLimitDemo extends Component {
  state = {
    rangeValue: ['', ''],
  };

  handleRangeChange = (e: CustomEvent) => {
    this.state.rangeValue = e.detail.value;
    this.update();
  };

  render() {
    return (
      <t-space direction="vertical">
        <div>示例：周末与范围外日期不可选</div>
        <t-date-range-picker
          disableDate={disableDate}
          value={this.state.rangeValue}
          onChange={this.handleRangeChange}
          placeholder={['开始日期', '结束日期']}
        />
      </t-space>
    );
  }
}
