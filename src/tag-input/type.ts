import type { TNode } from '../common';
import type { InputValue } from '../input';
import type { TagProps } from '../tag';

export type TagInputValue = string[];

export type TagInputTriggerSource = 'enter' | 'tag-remove' | 'backspace' | 'clear';

export interface TagInputChangeContext {
  trigger: TagInputTriggerSource;
  index?: number;
  item?: string;
  e?: MouseEvent | KeyboardEvent;
}

export interface TagInputRemoveContext {
  value: TagInputValue;
  index: number;
  item: string;
  trigger: 'tag-remove' | 'backspace';
  e?: MouseEvent | KeyboardEvent;
}

export interface CollapsedItemsParams {
  value: TagInputValue;
  collapsedSelectedItems: TagInputValue | Array<{ label?: string; value?: any; disabled?: boolean }>;
  count: number;
  onClose: (context: { index: number; e?: MouseEvent }) => void;
}

export interface TdTagInputProps {
  /** 是否可清空 */
  clearable?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 超出折叠显示方式：scroll 横向滚动 / break-line 换行 */
  excessTagsDisplayType?: 'scroll' | 'break-line';
  /** 最大标签数量 */
  max?: number;
  /** 最小折叠数量 */
  minCollapsedNum?: number;
  /** 占位符 */
  placeholder?: string;
  /** 只读 */
  readonly?: boolean;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 状态 */
  status?: 'default' | 'success' | 'warning' | 'error';
  /** 提示文本 */
  tips?: string;
  /** 标签值 */
  value?: TagInputValue;
  /** 默认标签值 */
  defaultValue?: TagInputValue;
  /** 输入框值 */
  inputValue?: InputValue;
  /** 默认输入框值 */
  defaultInputValue?: InputValue;
  /** 自定义标签 props */
  tagProps?: TagProps;
  /** 前置标签 */
  label?: any;
  /** 后置图标 */
  suffixIcon?: any;
  /** 宽度随内容自适应 */
  autoWidth?: boolean;
  /** 自定义值呈现的全部内容 */
  valueDisplay?: string | ((params: { value: TagInputValue; onClose: (index: number, item?: any) => void }) => any);
  /** 自定义折叠标签呈现方式 */
  collapsedItems?: TNode<CollapsedItemsParams>;
  /** 数据化配置选项内容 */
  options?: Array<{ label?: string; value?: any; disabled?: boolean }>;
  /** 标签值变化回调 */
  onChange?: (value: TagInputValue, context: TagInputChangeContext) => void;
  /** 输入框值变化回调 */
  onInputChange?: (value: InputValue, context: { e?: Event; trigger?: 'input' | 'clear' | 'enter' | 'blur' }) => void;
  /** 按下 Enter 回调 */
  onEnter?: (value: TagInputValue, context: { e: KeyboardEvent; inputValue: InputValue }) => void;
  /** 超出最大标签数量时回调 */
  onExceed?: (value: TagInputValue, context: { e: KeyboardEvent; inputValue: InputValue }) => void;
  /** 移除标签回调 */
  onRemove?: (context: TagInputRemoveContext) => void;
  /** 清空回调 */
  onClear?: (context: { e: MouseEvent }) => void;
  /** 聚焦回调 */
  onFocus?: (value: TagInputValue, context: { e: FocusEvent; inputValue: InputValue }) => void;
  /** 失焦回调 */
  onBlur?: (value: TagInputValue, context: { e: FocusEvent; inputValue: InputValue }) => void;
}
