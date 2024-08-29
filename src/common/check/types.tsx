import { TNode } from '../../common';

export interface TdCheckProps {
  /**
   * 用于标识是否为「全选选项」。单独使用无效，需在 CheckboxGroup 中使用
   * @default false
   */
  checkAll?: boolean;
  /**
   * 是否选中
   * @default false
   */
  checked?: boolean;
  /**
   * 是否选中，非受控属性
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * 多选框内容，同 label
   */
  children?: TNode;
  /**
   * 是否禁用组件。如果父组件存在 CheckboxGroup，默认值由 CheckboxGroup.disabled 控制。Checkbox.disabled 优先级高于 CheckboxGroup.disabled
   */
  disabled?: boolean;
  /**
   * 是否为半选
   * @default false
   */
  indeterminate?: boolean;
  /**
   * 主文案
   */
  label?: TNode;
  /**
   * HTML 元素原生属性
   * @default ''
   */
  name?: string;
  /**
   * 只读状态
   * @default false
   */
  readonly?: boolean;
  /**
   * 多选框的值
   */
  value?: string | number | boolean;
  /**
   * 值变化时触发
   */
  onChange?: (checked: boolean, context: { e: Event }) => void;
  /**
   * 点击时触发，一般用于外层阻止冒泡场景
   */
  onClick?: (context: { e: MouseEvent }) => void;
}
