import { isFunction } from 'lodash-es';
import { cloneElement, VNode } from 'omi';

import log from '../_common/js/log';
import { TNode } from '../common';

// 解析 TNode 数据结构
export default function parseTNode(
  renderNode: TNode | TNode<any> | undefined,
  renderParams?: any,
  defaultNode?: TNode,
): TNode {
  let node: TNode = null;

  if (typeof renderNode === 'function') {
    node = renderNode(renderParams);
  } else if (renderNode !== null) {
    node = renderNode ?? defaultNode;
  }
  return node as TNode;
}

/**
 * 解析各种数据类型的 TNode
 * 函数类型：content={(props) => <Icon></Icon>}
 * 组件类型：content={<Button>click me</Button>} 这种方式可以避免函数重复渲染，对应的 props 已经注入
 * 字符类型
 */
export function parseContentTNode<T>(tnode: TNode<T>, props: T) {
  if (isFunction(tnode)) return tnode(props) as TNode;
  if (!tnode || ['string', 'number', 'boolean'].includes(typeof tnode)) return tnode as TNode;
  try {
    return cloneElement(tnode as VNode, { ...props });
  } catch (e) {
    log.warn('parseContentTNode', `${tnode} is not a valid ReactNode`);
    return null;
  }
}
