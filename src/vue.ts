/**
 * 在Vue环境中使用的兼容方法
 */

import { render } from 'omi';

import { ExtendedElement } from './common';

const convertVueToOmi = (r: any): Omi.ComponentChild => {
  if (!r) return r;
  if (typeof r === 'string') return r;

  const { type, key, ref, children, props } = r;

  // vue的fragment
  if (typeof type === 'symbol' && type.toString() === 'Symbol(v-fgt)') {
    return children.map((c) => convertVueToOmi(c));
  }
  // vue的文本text
  if (typeof type === 'symbol' && type.toString() === 'Symbol(v-txt)') {
    return children;
  }

  const omiVNode = {
    nodeName: type,
    attributes: { ignoreAttrs: true, ref, ...props },
    key,
    children: [],
  };

  if (!children || children.length === 0) {
    return omiVNode;
  }

  if (Array.isArray(children)) {
    return {
      ...omiVNode,
      children: children.map((c) => convertVueToOmi(c)),
    };
  }

  return {
    ...omiVNode,
    children,
  };
};

/**
 * 在vue环境中渲染组件
 * @param reactVNode react的vnode结构
 * @param root 需要挂载的html
 */
const renderVue = <T = any>(reactVNode: T, root: HTMLElement): ExtendedElement =>
  render(convertVueToOmi(reactVNode), root);

export { renderVue, convertVueToOmi };
