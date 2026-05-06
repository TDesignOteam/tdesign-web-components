import 'tdesign-web-components/date-picker';
import 'tdesign-web-components/space';

import dayjs from 'dayjs';
import { Component } from 'omi';

const formatDate = (value: dayjs.Dayjs) => value.format('YYYY-MM-DD');
const today = dayjs();

const datePresets = {
  今天: formatDate(dayjs()),
  明天: () => formatDate(dayjs().add(1, 'day')),
  上周五: () => formatDate(dayjs().subtract(1, 'week').day(5)),
};

const dateRangePresets = {
  今天: [formatDate(today), formatDate(today)],
  昨天: [formatDate(today.subtract(1, 'day')), formatDate(dayjs())],
  近7天: () => [formatDate(dayjs().subtract(6, 'day')), formatDate(dayjs())],
  本月: () => [formatDate(dayjs().startOf('month')), formatDate(dayjs().endOf('month'))],
};

export default class DatePickerPresetsDemo extends Component {
  state = {
    value1: formatDate(dayjs()),
    value2: [formatDate(dayjs().subtract(6, 'day')), formatDate(dayjs())],
    value3: ['', ''],
  };

  handleChange1 = (value: string) => {
    this.state.value1 = value;
    this.update();
  };

  handleChange2 = (value: string[]) => {
    this.state.value2 = value;
    this.update();
  };

  handleChange3 = (value: string[]) => {
    this.state.value3 = value;
    this.update();
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-date-picker presets={datePresets} value={this.state.value1} onChange={this.handleChange1} />
        <t-date-range-picker
          presets={dateRangePresets}
          value={this.state.value2}
          onChange={this.handleChange2}
          placeholder={['开始日期', '结束日期']}
        />

        <span>自定义连缀符号和预设面板的位置</span>
        <t-date-range-picker
          presets={dateRangePresets}
          value={this.state.value3}
          onChange={this.handleChange3}
          presetsPlacement="right"
          separator="~"
        />
      </t-space>
    );
  }
}
