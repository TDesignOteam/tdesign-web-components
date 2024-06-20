import { TElement, TNode } from '../common';

export interface TdMenuProps {
  /**
   * 是否收起菜单
   * @default false
   */
  collapsed?: boolean;
  /**
   * 同级别互斥展开
   * @default false
   */
  expandMutex?: boolean;
  /**
   * 激活菜单项
   */
  value?: MenuValue;
  /**
   * 菜单宽度。值类型为数组时，分别表示菜单展开和折叠的宽度。[ 展开时的宽度, 折叠时的宽度 ]，示例：['200px', '80px']
   * @default '232px'
   */
  width?: string | number | Array<string | number>;
  /**
   * 激活菜单项发生变化时触发
   */
  onChange?: (value: MenuValue) => void;
  /**
   * 展开的菜单项发生变化时触发
   */
  onExpand?: (value: Array<MenuValue>) => void;
}

export interface TdMenuItemProps {
  /**
   * 菜单项内容
   */
  label?: TNode;
  /**
   * 是否禁用菜单项展开/收起/跳转等功能
   */
  disabled?: boolean;
  /**
   * 跳转链接
   * @default ''
   */
  href?: string;
  /**
   * 图标
   */
  icon?: TElement;
  /**
   * 链接或路由跳转方式
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /**
   * 菜单项唯一标识
   */
  value?: MenuValue;
  /**
   * 点击时触发
   */
  onClick?: (context: { e: HTMLElement; value: MenuValue }) => void;
}

export type MenuValue = string | number;
