import { ComponentChildren, VNode } from 'omi';

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

/** 获取children中的slot元素集合 */
export const getSlotNodes = (children?: ComponentChildren): VNode[] =>
  getChildrenArray(children).filter((node) => {
    if (node && typeof node === 'object') {
      return node.attributes?.slot;
    }
    return null;
  });

function camelCase(str: string): string {
  return str.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());
}

/**
 * 将DOM NodeList转换为Omi VNode
 * @param childNodes DOM NodeList
 * @returns Omi VNode[]
 */
const vnodePool = new WeakMap<Node, VNode | string>();
export function convertNodeListToVNodes(childNodes: NodeList): Array<VNode | string> {
  return Array.from(childNodes)
    .map((node): VNode | string => {
      // 增加对象池复用机制
      const cached = vnodePool.get(node);
      if (cached) return cached;
      // 处理文本节点
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }

      const element = node as Element;
      // 处理元素节点
      if (element.nodeType === Node.ELEMENT_NODE) {
        const attributes: any = {
          ignoreAttrs: false,
        };

        // 转换元素属性
        Array.from(element.attributes).forEach((attr) => {
          attributes[camelCase(attr.name)] = attr.value;
        });

        // 递归处理子节点
        const children = convertNodeListToVNodes(element.childNodes);
        const vnode = {
          nodeName: element.tagName.toLowerCase(),
          attributes,
          children,
          key: attributes.key,
        };
        // 在创建新VNode时更新缓存
        vnodePool.set(node, vnode);
        return vnode;
      }
      // 其他类型节点（注释等）返回 null
      return null as any;
    })
    .filter(Boolean); // 过滤掉 null 值
}

export function childNodesChanged(prevNodes: any, childNodes: any): boolean {
  if (prevNodes.length !== childNodes.length) return true;

  // 快速差异检查：只需检查首尾节点和长度变化
  return (
    prevNodes.length > 0 &&
    (prevNodes[0] !== childNodes[0] || prevNodes[prevNodes.length - 1] !== childNodes[childNodes.length - 1])
  );
}
