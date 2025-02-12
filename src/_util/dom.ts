import { isString } from 'lodash-es';
import raf from 'raf';

import { ScrollContainer, ScrollContainerElement } from '../common';
import { easeInOutCubic, EasingFunction } from './easing';
// 用于判断是否可使用 dom
export const canUseDocument = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * 获取滚动容器
 * 因为 document 不存在 scroll 等属性, 因此排除 document
 * window | HTMLElement
 * @param {ScrollContainerElement} [container='body']
 * @returns {ScrollContainer}
 */
export const getScrollContainer = (container: ScrollContainer = 'body'): ScrollContainerElement => {
  if (isString(container)) {
    return container ? (document.querySelector(container) as HTMLElement) : window;
  }
  if (typeof container === 'function') {
    return container();
  }
  return container || window;
};

// 获取 css vars
export const getCssVarsValue = (name: string, element?: HTMLElement) => {
  if (!canUseDocument) return;

  const el = element || document.documentElement;
  return getComputedStyle(el).getPropertyValue(name);
};

function isWindow(obj: any) {
  return obj && obj === obj.window;
}

type ScrollTarget = HTMLElement | Window | Document;

export function getScroll(target: ScrollTarget, isLeft?: boolean): number {
  // node环境或者target为空
  if (typeof window === 'undefined' || !target) {
    return 0;
  }
  const method = isLeft ? 'scrollLeft' : 'scrollTop';
  let result = 0;
  if (isWindow(target)) {
    result = (target as Window)[isLeft ? 'pageXOffset' : 'pageYOffset'];
  } else if (target instanceof Document) {
    result = target.documentElement[method];
  } else if (target) {
    result = (target as HTMLElement)[method];
  }
  return result;
}

interface ScrollTopOptions {
  container?: ScrollTarget;
  duration?: number;
  easing?: EasingFunction;
}

export const scrollTo = (target: number, opt: ScrollTopOptions) => {
  const { container = window, duration = 450, easing = easeInOutCubic } = opt;
  const scrollTop = getScroll(container);
  const startTime = Date.now();
  return new Promise((res) => {
    const fnc = () => {
      const timestamp = Date.now();
      const time = timestamp - startTime;
      const nextScrollTop = easing(Math.min(time, duration), scrollTop, target, duration);
      if (isWindow(container)) {
        (container as Window).scrollTo(window.pageXOffset, nextScrollTop);
      } else if (container instanceof HTMLDocument || container.constructor.name === 'HTMLDocument') {
        (container as HTMLDocument).documentElement.scrollTop = nextScrollTop;
      } else {
        (container as HTMLElement).scrollTop = nextScrollTop;
      }
      if (time < duration) {
        raf(fnc);
      } else {
        // 由于上面步骤设置了 scrollTop, 滚动事件可能未触发完毕
        // 此时应该在下一帧再执行 res
        raf(res);
      }
    };
    raf(fnc);
  });
};

export const getAttach = (node: any): HTMLElement => {
  const attachNode = typeof node === 'function' ? node() : node;
  if (!attachNode) {
    return document.body;
  }
  if (isString(attachNode)) {
    return document.querySelector(attachNode);
  }
  if (attachNode instanceof HTMLElement) {
    return attachNode;
  }
  return document.body;
};

export const addClass = function (el: Element, cls: string) {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ` ${clsName}`;
    }
  }
  if (!el.classList) {
    // eslint-disable-next-line
    el.className = curClass;
  }
};

const trim = (str: string): string => (str || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');

export const removeClass = function (el: Element, cls: string) {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ` ${el.className} `;

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ');
    }
  }
  if (!el.classList) {
    // eslint-disable-next-line
    el.className = trim(curClass);
  }
};

export function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  }
  return ` ${el.className} `.indexOf(` ${cls} `) > -1;
}

// 判断一个元素是否包含另一个元素
export function domContains(parent: HTMLElement, child: HTMLElement) {
  if (!parent || !child) return false;
  if (parent.contains(child)) {
    return true;
  }

  let matched = false;
  if (parent.shadowRoot) {
    const children = Array.from(parent.shadowRoot.children);
    for (let i = 0; i < children.length; i++) {
      if (children[i].isSameNode(child) || children[i].contains(child)) {
        matched = true;
      } else if (children[i].shadowRoot) {
        matched = domContains(children[i] as any, child);
      }
      if (matched) break;
    }
  }
  return matched;
}

// DOM properties that should NOT have "px" added when numeric
export const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

export function setStyle(style: CSSStyleDeclaration, key: string, value: string | number | null) {
  if (key[0] === '-') {
    style.setProperty(key, value == null ? '' : value.toString());
  } else if (value == null) {
    // eslint-disable-next-line no-param-reassign
    (style as any)[key] = '';
  } else if (typeof value !== 'number' || IS_NON_DIMENSIONAL.test(key)) {
    // eslint-disable-next-line no-param-reassign
    (style as any)[key] = value.toString();
  } else {
    // eslint-disable-next-line no-param-reassign
    (style as any)[key] = `${value}px`;
  }
}

// 用于判断节点内容是否溢出
export const isNodeOverflow = (ele: Element | Element[]): boolean => {
  const { clientWidth = 0, scrollWidth = 0 } = ele as Element;
  return scrollWidth > clientWidth;
};
