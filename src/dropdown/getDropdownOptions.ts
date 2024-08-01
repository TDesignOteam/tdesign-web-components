import './dropdownItem';
import './dropdownMenu';

import { toArray } from 'lodash';

import { TElement, TNode } from '../common';
import { DropdownOption } from './type';

export const getOptionsFromChildren = (children: TElement | any): DropdownOption[] => {
  if (!children) return [];

  if (children.nodeName === 't-dropdown-menu') {
    const groupChildren = children.children;
    if (Array.isArray(groupChildren)) {
      return getOptionsFromChildren(groupChildren);
    }
  }

  return toArray(children)
    .map((item: TElement) => {
      const groupChildren = item?.children;
      // eslint-disable-next-line no-param-reassign
      // delete (item.attributes as any).ignoreAttrs;
      const contextRes = (item.attributes as any)?.content;

      if (Array.isArray(groupChildren)) {
        const contentCtx = groupChildren?.filter?.((v) => !['t-dropdown-item', 't-dropdown-menu'].includes(v.nodeName));
        const childrenCtx = groupChildren?.filter?.((v) => ['t-dropdown-item', 't-dropdown-menu'].includes(v.nodeName));

        return {
          ...item.attributes,
          content: contentCtx || groupChildren,
          children: childrenCtx.length > 0 ? getOptionsFromChildren(groupChildren[1]) : null,
        };
      }
      return { ...item.attributes, content: groupChildren || contextRes, children: null };
    })
    .filter((v) => !!v.content);
};

export default function getDropdownOptions(children: TNode[], options: DropdownOption[]): DropdownOption[] {
  if (options && options.length > 0) return options;
  let dropdownMenuChild: any;
  children.forEach((child: TElement) => {
    if (!child) return;

    if (child.nodeName === 't-dropdown-menu' && child.children) {
      dropdownMenuChild = child.children;
    }
  });
  return getOptionsFromChildren(dropdownMenuChild);
}
