/**
 * 在React环境中使用的兼容方法
 */

import { Component, render } from 'omi';

export type ExtendedElement = (HTMLElement | SVGAElement | HTMLInputElement) & {
  receiveProps: Function;
  update: Function;
  queuedUpdate: Function;
  store?: unknown;
  className?: string;
  props: Record<string, unknown>;
  splitText?: Function;
  prevProps?: Record<string, unknown> & {
    ref?:
      | {
          current?: unknown;
        }
      | Function;
  };
  attributes: NamedNodeMap;
  _component?: Component;
  _listeners: Record<string, Function>;
} & Record<string, unknown>;

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
const renderReact = <T = any>(reactVNode: T, root: HTMLElement): ExtendedElement =>
  render(convertReactToOmi(reactVNode), root);

export { renderReact, convertReactToOmi };
