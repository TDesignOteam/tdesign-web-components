import { TElement, TNode } from '../common';

export interface TdAlertProps {
  /**
   * 关闭按钮。值为 true 则显示默认关闭按钮；
   * 值为 false 则不显示按钮；
   * 值类型为 string 则直接显示；
   * 值类型为 Function 则可以自定关闭按钮
   *
   * @default: false
   */
  close?: TNode;
  /**
   * 图标
   */
  icon?: TElement;
  /**
   * 内容显示最大行数，超出的内容会折叠收起，用户点击后再展开。
   * 值为 0 表示不折叠
   *
   * @default: 0
   */
  maxLine?: number;
  /**
   * 内容（子元素）
   */
  message?: TNode;
  /**
   * 跟在告警内容后面的操作区。
   */
  operation?: TNode;
  /**
   * 组件风格。可选项：success/info/warning/error
   *
   * @default: info
   */
  theme?: string;
  /**
   * 标题
   */
  title?: TNode;
  /**
   * 关闭按钮点击时触发
   */
  onClose?: (context: { e: MouseEvent }) => void;
  /**
   * 告警提示框关闭动画结束后触发
   */
  onClosed?: (context: { e: TransitionEvent }) => void;
  /**
   * 忽略的属性列表，忽略后，将不会传递给父元素
   */
  ignoreAttributes?: string[];
}
