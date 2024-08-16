import { cloneElement, VNode } from 'omi';

import { TNode } from '../common';

// 在light-dom的icon上添加inline-flex样式，解决icon在flex布局下不居中的问题
export const flexIcon = (icon: TNode) => {
  if (!icon) {
    return icon;
  }
  return cloneElement(icon as VNode, { className: `inline-flex ${(icon as VNode).attributes.className || ''}` });
};
