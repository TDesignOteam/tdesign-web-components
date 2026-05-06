/**
 * 在React环境中使用的兼容方法
 */

import { render } from 'omi';

import { ExtendedElement } from './common';

const convertReactToOmi = (r: any): Omi.ComponentChild => {
  if (!r) return r;

  if (typeof r === 'string') return r;

  const {
    type,
    key,
    ref,
    props: { children, ...rest },
  } = r;

  const omiVNode = {
    nodeName: type,
    attributes: { ignoreAttrs: true, ref, ...rest },
    key,
    children: [],
  };

  if (!children) {
    return omiVNode;
  }

  if (Array.isArray(children)) {
    return {
      ...omiVNode,
      children: children.map((c: any) => convertReactToOmi(c)),
    };
  }

  if (typeof children === 'object') {
    return {
      ...omiVNode,
      children: [children].map((c: any) => convertReactToOmi(c)),
    };
  }

  return {
    ...omiVNode,
    children,
  };
};

/**
 * 在react环境中渲染组件
 * @param reactVNode react的vnode结构
 * @param root 需要挂载的html
 */
const renderReactToOmi = <T = any>(reactVNode: T, root: HTMLElement): ExtendedElement => {
  const vnode = convertReactToOmi(reactVNode);
  console.log('====vnode', vnode, root);
  return render(convertReactToOmi(reactVNode), root);
};

export { renderReactToOmi, convertReactToOmi };
