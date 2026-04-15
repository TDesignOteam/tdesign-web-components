import { cloneElement, VNode } from 'omi';

import { TNode } from '../common';

/**
 * 为传入的 icon 统一增加居中展示样式，避免在 flex 布局下出现上下偏移。
 */
const hostStyleString = 'display:inline-flex;align-items:center;justify-content:center;fill:none;';

export const flexIcon = (icon: TNode) => {
  // 防止生成<undefined></undefined>
  if (!icon || typeof icon !== 'object' || !('nodeName' in icon || 'attributes' in icon)) {
    return null;
  }

  if (!icon) return icon;

  const vnode = icon as VNode;
  const attrs = vnode.attributes || {};

  // 追加 inline-flex，保持原有 class
  const existingClassName = attrs.className || attrs.class || '';
  const mergedClassName = ['inline-flex', existingClassName].filter(Boolean).join(' ');

  let mergedStyle: any = hostStyleString;
  let mergedInnerStyle: any = attrs.innerStyle;

  if (typeof attrs.style === 'string' && attrs.style.trim()) {
    // style 为字符串时追加缺失的布局信息
    let styleString = attrs.style.trim();
    if (!/display\s*:/.test(styleString)) {
      styleString = `${styleString};display:inline-flex;`;
    }
    if (!/align-items\s*:/.test(styleString)) {
      styleString = `${styleString};align-items:center;`;
    }
    if (!/justify-content\s*:/.test(styleString)) {
      styleString = `${styleString};justify-content:center;`;
    }
    if (!/fill\s*:/.test(styleString)) {
      styleString = `${styleString};fill:none;`;
    }
    mergedStyle = styleString;
  } else if (attrs.style && typeof attrs.style === 'object') {
    // style 为对象时补全默认值
    mergedStyle = {
      ...attrs.style,
      display: attrs.style.display || 'inline-flex',
      alignItems: attrs.style.alignItems || 'center',
      justifyContent: attrs.style.justifyContent || 'center',
      fill: attrs.style.fill || 'none',
    };
  }

  if (typeof attrs.innerStyle === 'string' && attrs.innerStyle.trim()) {
    // innerStyle 为字符串时补全填充信息
    const hasFill = /fill\s*:/.test(attrs.innerStyle);
    mergedInnerStyle = hasFill ? attrs.innerStyle : `${attrs.innerStyle};fill:none;`;
  } else if (attrs.innerStyle && typeof attrs.innerStyle === 'object') {
    mergedInnerStyle = {
      ...attrs.innerStyle,
      fill: attrs.innerStyle.fill || 'none',
    };
  }

  return cloneElement(vnode, {
    class: mergedClassName,
    className: mergedClassName,
    style: mergedStyle,
    innerStyle: mergedInnerStyle,
  });
};
