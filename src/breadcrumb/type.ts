import { TNode } from '../common';

export interface TdBreadcrumbProps {
  /**
   * 类名
   */
  className?: string;
  /**
   * 单项最大宽度，超出后会以省略号形式呈现
   */
  maxItemWidth?: string;
  /**
   * 面包屑项，功能同 BreadcrumbItem
   */
  options?: Array<TdBreadcrumbItemProps>;
  /**
   * 自定义分隔符
   */
  separator?: string | TNode;
}

export interface TdBreadcrumbItemProps {
  /**
   * 类名
   */
  className?: string;
  /**
   *
   */
  content?: TNode;
  /**
   * 是否禁用当前项点击
   */
  disabled?: boolean;
  /**
   * 跳转链接
   * @default ''
   */
  href?: string;
  /**
   * 最大宽度，超出后会以省略号形式呈现。优先级高于 Breadcrumb 中的 maxItemWidth
   */
  maxWidth?: string;
  /**
   * 链接或路由跳转方式
   * @default _self
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /**
   * 点击时触发
   */
  onClick?: (e: MouseEvent) => void;
  /**
   * 内容
   */
  children?: TNode;
  /**
   * 是否最后一个
   * @default false
   */
  isLast?: boolean;
}
