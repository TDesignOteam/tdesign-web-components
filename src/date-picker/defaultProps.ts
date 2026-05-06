import { DatePickerProps } from './DatePicker';
import { DateRangePickerProps } from './DateRangePicker';

export const datePickerDefaultProps: Partial<DatePickerProps> = {
  mode: 'date',
  allowInput: false,
  clearable: false,
  firstDayOfWeek: 1,
  placeholder: '请选择日期',
};

export const dateRangePickerDefaultProps: Partial<DateRangePickerProps> = {
  mode: 'date',
  allowInput: false,
  clearable: false,
  firstDayOfWeek: 1,
  placeholder: ['请选择日期', '请选择日期'],
};
