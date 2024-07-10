import { ComponentChildren } from 'omi';

/**
 * 将Component的children转换为数组
 * @param children ComponentChildren | undefined
 * @returns ComponentChildren[]
 */
export function getChildrenArray(children?: ComponentChildren) {
  if (!children) {
    return [];
  }
  if (Array.isArray(children)) {
    return children;
  }
  return [children];
}

/**
 * 判断是否某个name的slot
 * @param name string
 * @param children ComponentChildren | undefined
 * @returns boolean
 */
export function hasSlot(name: string, children?: ComponentChildren) {
  const childrenArray = getChildrenArray(children);

  return childrenArray.some((child) => {
    if (typeof child === 'object' && 'attributes' in child) {
      return child.attributes?.slot === name;
    }
    return false;
  });
}
