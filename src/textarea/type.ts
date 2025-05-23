import { TNode } from '../common';

export interface TdTextareaProps {
  /**
   * 超出maxlength或maxcharacter之后是否还允许输入
   * @default false
   */
  allowInputOverMax?: boolean;
  /**
   * 自动聚焦，拉起键盘
   * @default false
   */
  autofocus?: boolean;
  /**
   * 高度自动撑开。 autosize = true 表示组件高度自动撑开，同时，依旧允许手动拖高度。如果设置了 autosize.maxRows 或者 autosize.minRows 则不允许手动调整高度
   * @default false
   */
  autosize?: boolean | { minRows?: number; maxRows?: number };
  /**
   * 是否禁用文本框
   * @default false
   */
  disabled?: boolean;
  /**
   * 左侧文本
   */
  label?: TNode;
  /**
   * 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度
   */
  maxcharacter?: number;
  /**
   * 用户最多可以输入的字符个数
   */
  maxlength?: number;
  /**
   * 名称，HTML 元素原生属性
   * @default ''
   */
  name?: string;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 只读状态
   * @default false
   */
  readonly?: boolean;
  /**
   * 文本框状态
   */
  status?: 'default' | 'success' | 'warning' | 'error';
  /**
   * 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式
   */
  tips?: TNode;
  /**
   * 文本框值
   */
  value?: TextareaValue;
  /**
   * 文本框值，非受控属性
   */
  defaultValue?: TextareaValue;
  enterkeyhint?: String;
  /**
   * 失去焦点时触发
   */
  onBlur?: (value: TextareaValue, context: { e: FocusEvent }) => void;
  /**
   * 输入内容变化时触发:
   */
  onChange?: (value: TextareaValue, context?: { e?: Event }) => void;
  /**
   * 获得焦点时触发
   */
  onFocus?: (value: TextareaValue, context: { e: FocusEvent }) => void;
  /**
   * 键盘按下时触发
   */
  onKeydown?: (value: TextareaValue, context: { e: KeyboardEvent }) => void;
  /**
   * 按下字符键时触发（keydown -> keypress -> keyup）
   */
  onKeypress?: (value: TextareaValue, context: { e: KeyboardEvent }) => void;
  /**
   * 释放键盘时触发
   */
  onKeyup?: (value: TextareaValue, context: { e: KeyboardEvent }) => void;
}

export type TextareaValue = string;
