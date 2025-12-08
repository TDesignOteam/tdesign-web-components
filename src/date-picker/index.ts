import './style/index.js';

import _DatePicker from './DatePicker';
import _DateRangePicker from './DateRangePicker';

export type { DatePickerProps } from './DatePicker';
export type { DateRangePickerProps } from './DateRangePicker';

export const DatePicker = _DatePicker;
export const DateRangePicker = _DateRangePicker;

export default DatePicker;

export * from './type';
