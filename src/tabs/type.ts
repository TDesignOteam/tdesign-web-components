import { TNode } from '../common';

export interface TdTabsProps {
  /**
   * 内容
   */
  children?: TNode;
  /**
   * 选项卡列表
   */
  list?: Array<TdTabPanelProps>;
  /**
   * 是否禁用选项卡
   * @default false
   */
  disabled?: boolean;
  /**
   * 选项卡位置
   * @default top
   */
  placement?: 'left' | 'top' | 'bottom' | 'right';
  /**
   * 组件尺寸
   * @default medium
   */
  size?: 'medium' | 'large';
  /**
   * 选项卡风格，包含 默认风格 和 卡片风格两种
   * @default normal
   */
  theme?: 'normal' | 'card';
  /**
   * 激活的选项卡值
   */
  value?: TabValue;
  /**
   * 激活的选项卡值，非受控属性
   */
  defaultValue?: TabValue;
  /**
   * 激活的选项卡发生变化时触发
   */
  onChange?: (value: TabValue) => void;
}

export interface TdTabPanelProps {
  /**
   * 用于自定义选项卡面板内容
   */
  panel?: TNode;
  /**
   * 是否禁用当前选项卡
   * @default false
   */
  disabled?: boolean;
  /**
   * 内容
   */
  children?: TNode;
  /**
   * 选项卡名称，可自定义选项卡导航内容
   */
  label?: TNode;
  /**
   * 选项卡的值，唯一标识
   */
  value?: TabValue;
}

export type TabValue = string | number;
