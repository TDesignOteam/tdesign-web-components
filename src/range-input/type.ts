import { InputFormatType, InputValue } from 'tdesign-web-components/input';

import { TNode } from '../common';

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

export type RangeInputValue = Array<InputValue>;

export type RangeInputPosition = 'first' | 'second' | 'all';
