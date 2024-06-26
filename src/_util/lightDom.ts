import { Component, define } from 'omi';

import { TNode } from '../common';
import parseTNode from './parseTNode';

const createStyleSheet = (style: string) => {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(style);

  Object.defineProperty(styleSheet, 'styleStr', {
    get() {
      return style;
    },
  });

  return styleSheet;
};

type CSSItem = { default: string } | string;

type ComponentConstructor = {
  new (): Component;
  is: 'Component';
  isLightDOM: boolean;
  css: CSSItem | CSSItem[];
};

const getCssList = (css: ComponentConstructor['css']): string[] => {
  if (Array.isArray(css)) {
    return css.map((item) => getCssList(item)).flat();
  }
  if (typeof css === 'object' && typeof css.default === 'string') {
    return [css.default];
  }
  if (typeof css === 'string') {
    return [css];
  }
  return [];
};

const findParentRenderRoot = (ele): Document | ShadowRoot => {
  if (ele.shadowRoot && ele.renderRoot && ele.renderRoot.adoptedStyleSheets) {
    return ele.renderRoot;
  }
  if (ele.parentElement) {
    return findParentRenderRoot(ele.parentElement);
  }
  return document;
};

const lightDomCtorCache: Map<ComponentConstructor, ComponentConstructor> = new Map();

/**
 * 继承 nodeCtor 构建 lightDomCtor
 * @param nodeCtor WeElementConstructor
 * @returns WeElementConstructor
 */
const buildLightDomCtor = (nodeCtor: ComponentConstructor) => {
  const cacheCtor = lightDomCtorCache.get(nodeCtor);
  if (cacheCtor) {
    return cacheCtor;
  }

  class TNodeLightDom extends nodeCtor {
    static isLightDOM = true;

    /**
     * 处理原 ShadowRoot 的样式表
     * 合并到上层的 ShadowRoot | document 样式表中
     */
    beforeRender() {
      const parentElement = findParentRenderRoot(this);

      const cssList = getCssList(nodeCtor.css);
      cssList.forEach((style) => {
        const preStyleSheet = parentElement.adoptedStyleSheets.find((item) => (item as any).styleStr === style);
        if (preStyleSheet) {
          return;
        }

        const styleSheet = createStyleSheet(style);
        parentElement.adoptedStyleSheets = [...parentElement.adoptedStyleSheets, styleSheet];
      });
    }
  }

  lightDomCtorCache.set(nodeCtor, TNodeLightDom);
  return TNodeLightDom;
};

/**
 * 转换为 lightDom Node
 * @param node TNode
 * @returns TNode
 */
export const convertToLightDomNode = (node: TNode) => {
  const tNode = parseTNode(node);
  if (!(typeof tNode === 'object' && 'nodeName' in tNode && typeof tNode.nodeName === 'string')) {
    return tNode;
  }

  // 找到之前注册的组件
  const nodeCtor = customElements.get(tNode.nodeName) as ComponentConstructor;
  if (!(nodeCtor && nodeCtor.is === 'Component' && !nodeCtor.isLightDOM)) {
    return tNode;
  }

  // 构建 lightDom 组件
  const lightDomCtor = buildLightDomCtor(nodeCtor);

  // 注册新的组件
  const lightDomNodeName = `${tNode.nodeName}-light-dom`;
  if (!customElements.get(lightDomNodeName)) {
    define(lightDomNodeName, lightDomCtor);
  }

  return {
    ...tNode,
    nodeName: lightDomNodeName,
  };
};
