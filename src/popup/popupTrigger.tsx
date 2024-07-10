import { toArray } from 'lodash';
import { cloneElement, Component, tag, VNode } from 'omi';

import { TNode } from '../common';

@tag('t-trigger')
export default class Trigger extends Component {
  render(props) {
    const children = toArray(props.children).map((child: TNode) => {
      // 对 t-button 做特殊处理
      if (typeof child === 'object' && (child as any).nodeName === 't-button') {
        const oldClick = (child as VNode).attributes?.onClick;
        return cloneElement(child as VNode, {
          onClick: (e) => {
            if (oldClick) oldClick(e);
            this.fire('click', { ...e.detail });
          },
        });
      }
      return child;
    });
    return children;
  }
}
