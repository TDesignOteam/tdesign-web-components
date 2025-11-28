import { TNode } from '../common';

export type DateValue = string | number | Date;

export type DateRangeValue = Array<DateValue>;

export interface DisableDateObject {
  before?: DateValue;
  after?: DateValue;
  from?: DateValue;
  to?: DateValue;
}

export type DisableDate = DateValue[] | DisableDateObject | ((date: DateValue) => boolean);

export interface PresetDate {
  [name: string]: DateValue | (() => DateValue);
}

export interface PresetRange {
  [name: string]: DateRangeValue | (() => DateRangeValue);
}

export interface TdDatePickerProps {
  /** 选中值 */
  value?: DateValue;
  /** 选中值，非受控属性 */
  defaultValue?: DateValue;
  /** 用于格式化日期显示的格式 */
  format?: string;
  /** 用于格式化日期值的类型，对比 format 只用于展示 */
  valueType?: string;
  /** 选择器模式 */
  mode?: 'date' | 'month' | 'year' | 'week' | 'quarter';
  /** 一周的起始天（0-6） */
  firstDayOfWeek?: number;
  /** 禁用日期 */
  disableDate?: DisableDate;
  /** 最小可选日期 */
  minDate?: DateValue;
  /** 最大可选日期 */
  maxDate?: DateValue;
  /** 预设快捷日期选择 */
  presets?: PresetDate;
  /** 预设面板展示区域（左侧/下侧） */
  presetsPlacement?: 'left' | 'top' | 'right' | 'bottom';
  /** 是否需要点击确认按钮 */
  needConfirm?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 输入框下方提示 */
  tips?: any;
  /** 输入框状态 */
  status?: 'default' | 'success' | 'warning' | 'error';
  /** 是否无边框 */
  borderless?: boolean;
  /** 是否禁用组件 */
  disabled?: boolean;
  /** 是否显示清除按钮 */
  clearable?: boolean;
  /** 是否允许输入日期 */
  allowInput?: boolean;
  /** 左侧文本内容 */
  label?: any;
  /** 自定义前缀图标 */
  prefixIcon?: TNode;
  /** 自定义后缀图标 */
  suffixIcon?: TNode;
  /** 自定义样式 */
  style?: Record<string, any> | string;
  /** 自定义 class 类名 */
  class?: string;
  /** 设置面板是否可见（受控） */
  popupVisible?: boolean;
  /** 默认面板显示状态（非受控） */
  defaultPopupVisible?: boolean;
  /** 透传给输入框组件的属性 */
  inputProps?: any;
  /** 透传给 popup 组件的参数 */
  popupProps?: any;
  /** 透传给 tagInput 组件的参数 */
  tagInputProps?: any;
  /** 选中值变化时触发 */
  onChange?: (value: DateValue, context?: any) => void;
  /** 面板显示/隐藏切换时触发 */
  onVisibleChange?: (visible: boolean, context?: any) => void;
  /** 用户选择日期时触发 */
  onPick?: (value: Date, context?: any) => void;
  /** 点击预设按钮后触发 */
  onPresetClick?: (context?: any) => void;
  /** 点击清除按钮时触发 */
  onClear?: (context?: any) => void;
  /** 输入框获得焦点时触发 */
  onFocus?: (context?: any) => void;
  /** 输入框失去焦点时触发 */
  onBlur?: (context?: any) => void;
}

export interface TdDateRangePickerProps {
  /** 选中值 */
  value?: DateRangeValue;
  /** 选中值，非受控属性 */
  defaultValue?: DateRangeValue;
  /** 用于格式化日期显示的格式 */
  format?: string;
  /** 用于格式化日期值的类型，对比 format 只用于展示 */
  valueType?: string;
  /** 选择器模式 */
  mode?: 'date' | 'month' | 'year' | 'week' | 'quarter';
  /** 一周的起始天（0-6） */
  firstDayOfWeek?: number;
  /** 禁用日期 */
  disableDate?: DisableDate;
  /** 是否允许取消选中范围选择限制，设置为 true 将不再限制结束日期必须大于开始日期 */
  cancelRangeSelectLimit?: boolean;
  /** 是否在选中日期时预选高亮 */
  panelPreselection?: boolean;
  /** 预设快捷日期选择 */
  presets?: PresetRange;
  /** 预设面板展示区域（左侧/下侧） */
  presetsPlacement?: 'left' | 'top' | 'right' | 'bottom';
  /** 占位符 */
  placeholder?: string | string[];
  /** 输入框下方提示 */
  tips?: any;
  /** 输入框状态 */
  status?: 'default' | 'success' | 'warning' | 'error';
  /** 是否禁用组件 */
  disabled?: boolean;
  /** 是否显示清除按钮 */
  clearable?: boolean;
  /** 是否允许输入日期 */
  allowInput?: boolean;
  /** 左侧文本内容 */
  label?: any;
  /** 范围分隔符 */
  separator?: TNode;
  /** 自定义前缀图标 */
  prefixIcon?: TNode;
  /** 自定义后缀图标 */
  suffixIcon?: TNode;
  /** 自定义样式 */
  style?: Record<string, any> | string;
  /** 自定义 class 类名 */
  class?: string;
  /** 设置面板是否可见（受控） */
  popupVisible?: boolean;
  /** 默认面板显示状态（非受控） */
  defaultPopupVisible?: boolean;
  /** 透传给输入框组件的属性 */
  rangeInputProps?: any;
  /** 透传给 popup 组件的参数 */
  popupProps?: any;
  /** 选中值变化时触发 */
  onChange?: (value: DateRangeValue, context?: any) => void;
  /** 面板显示/隐藏切换时触发 */
  onVisibleChange?: (visible: boolean, context?: any) => void;
  /** 用户选择日期时触发 */
  onPick?: (value: Date, context?: any) => void;
  /** 点击预设按钮后触发 */
  onPresetClick?: (context?: any) => void;
  /** 点击清除按钮时触发 */
  onClear?: (context?: any) => void;
}
