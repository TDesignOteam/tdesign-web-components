/* eslint-disable */

import { StyledProps, TNode } from '../common';

export interface ListProps extends StyledProps {
  children?: TNode;
  split?: boolean;
  stripe?: boolean;
  dragSort?: boolean;

  asyncLoading?: string | Function;
  footer?: string | TNode;
  header?: string | TNode;

  layout?: string;
  size?: string;

  onLoadMore?: Function;
  onScroll?: Function;
}

export interface ListItemProps extends StyledProps {
  /**
   * 操作栏
   */
  action?: string | TNode;
  /**
   * 内容，同 content
   */
  children?: string | TNode;
  /**
   * 内容
   */
  content?: string | TNode;

  onClick?: Function;
}

export type ListItemMetaProps = {
  /**
   * 列表项内容
   */
  description?: string | TNode;
  /**
   * 列表项图片
   */
  image?: string | TNode;
  /**
   * 列表项标题
   */
  title?: string | TNode;
};
