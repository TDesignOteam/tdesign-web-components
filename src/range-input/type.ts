import { TNode } from '../common';
import { InputFormatType, InputValue } from '../input';
import { PopupProps } from '../popup';
import { RangeInputProps } from './RangeInput';

export interface TdRangeInputProps {
  /**
   * 输入框高亮状态序号
   */
  activeIndex?: number;
  /**
   * 是否可清空
   * @default false
   */
  clearable?: boolean;
  /**
   * 是否禁用范围输入框
   */
  disabled?: boolean;
  /**
   * 指定输入框展示值的格式
   */
  format?: InputFormatType | Array<InputFormatType>;
  /**
   * 占位符，示例：'请输入' 或者 ['开始日期', '结束日期']
   */
  placeholder?: string | Array<string>;
  /**
   * 只读状态
   * @default false
   */
  readonly?: boolean;
  /**
   * 后缀图标
   */
  suffixIcon?: TNode;
  /**
   * 范围分隔符
   * @default '-'
   */
  separator?: TNode;
  /**
   * 输入框尺寸
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 输入框状态
   * @default default
   */
  status?: 'default' | 'success' | 'warning' | 'error';
  /**
   * 范围输入框的值
   * @default []
   */
  value?: RangeInputValue;
  /**
   * 范围输入框的值，非受控属性
   * @default []
   */
  defaultValue?: RangeInputValue;
  /**
   * 范围输入框失去焦点时触发
   */
  onBlur?: (
    evt: CustomEvent<{
      value: RangeInputValue;
      context?: {
        e?: FocusEvent;
        position?: RangeInputPosition;
      };
    }>,
  ) => void;
  /**
   * 范围输入框值发生变化时触发
   */
  onChange?: (
    evt: CustomEvent<{
      value: RangeInputValue;
      context?: {
        e?: HTMLElement;
        position?: RangeInputPosition;
        trigger?: 'input' | 'initial' | 'clear';
      };
    }>,
  ) => void;
  /**
   * 范围输入框获得焦点时触发
   */
  onFocus?: (
    evt: CustomEvent<{
      value: RangeInputValue;
      context?: {
        e?: FocusEvent;
        position?: RangeInputPosition;
      };
    }>,
  ) => void;
  /**
   * 进入输入框时触发
   */
  onMouseenter?: (
    evt: CustomEvent<{
      context: {
        e: MouseEvent;
      };
    }>,
  ) => void;
  /**
   * 离开输入框时触发
   */
  onMouseleave?: (
    evt: CustomEvent<{
      context: {
        e: MouseEvent;
      };
    }>,
  ) => void;
}

export interface TdRangeInputPopupProps {
  /**
   * 宽度随内容自适应
   * @default false
   */
  autoWidth?: boolean;
  /**
   * 是否可清空
   * @default false
   */
  clearable?: boolean;
  /**
   * 是否禁用范围输入框，值为数组表示可分别控制某一个输入框是否禁用
   */
  disabled?: boolean;
  /**
   * 输入框的值
   */
  inputValue?: RangeInputValue;
  /**
   * 输入框的值，非受控属性
   */
  defaultInputValue?: RangeInputValue;
  /**
   * 左侧文本
   */
  label?: TNode;
  /**
   * 下拉框内容，可完全自定义
   */
  panel?: TNode;
  /**
   * 透传 Popup 浮层组件全部属性
   */
  popupProps?: PopupProps;
  /**
   * 是否显示下拉框
   */
  popupVisible?: boolean;
  /**
   * 透传 RangeInput 组件全部属性
   */
  rangeInputProps?: RangeInputProps;
  /**
   * 只读状态，值为真会隐藏输入框，且无法打开下拉框
   * @default false
   */
  readonly?: boolean;
  /**
   * 输入框状态
   * @default default
   */
  status?: 'default' | 'success' | 'warning' | 'error';
  /**
   * 后缀图标
   */
  suffixIcon?: TNode;
  /**
   * 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式
   */
  tips?: TNode;
  /**
   * 输入框值发生变化时触发
   */
  onInputChange?: (value: RangeInputValue, context?: any) => void;
  /**
   * 下拉框显示或隐藏时触发
   */
  onPopupVisibleChange?: (visible: boolean, context: any) => void;
}

export type RangeInputValue = Array<InputValue>;

export type RangeInputPosition = 'first' | 'second' | 'all';
