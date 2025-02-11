import './avatar';

import { toArray } from 'lodash-es';
import { classNames, cloneElement, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import { TdAvatarGroupProps } from './type';

export interface AvatarGroupProps extends TdAvatarGroupProps, StyledProps {}

@tag('t-avatar-group')
export default class AvatarGroup extends Component<AvatarGroupProps> {
  static css = [];

  static defaultProps = { cascading: 'right-up' };

  static propTypes = {
    cascading: String,
    max: Number,
    size: String,
    collapseAvatar: Object,
    children: Object,
  };

  preClass = `${getClassPrefix()}-avatar`;

  provide = { groupSize: undefined as any };

  install() {
    this.provide = { groupSize: this.props.size };
  }

  render(props: OmiProps<AvatarGroupProps, any>) {
    const { preClass } = this;
    const { children, max, cascading, collapseAvatar } = props;
    const childrenList = toArray(children);
    let allChildrenList = [];
    if (childrenList.length > 0) {
      allChildrenList = childrenList.map((child, index) => {
        const childNode = cloneElement(child, {
          key: `avatar-group-item-${index}`,
        });
        return convertToLightDomNode(childNode);
      });
    }
    const groupClass = classNames(`${preClass}-group`, this.className, {
      [`${preClass}--offset-right`]: cascading === 'right-up',
      [`${preClass}--offset-left`]: cascading === 'left-up',
    });

    const childrenCount = childrenList.length;
    if (props.max && childrenCount > max) {
      const showList = allChildrenList.slice(0, max);
      const ellipsisAvatar = (
        <t-avatar
          key={`${preClass}__collapse`}
          content={parseTNode(collapseAvatar) || `+${childrenCount - max}`}
        ></t-avatar>
      );
      showList.push(convertToLightDomNode(ellipsisAvatar));
      return <div class={groupClass}>{showList}</div>;
    }
    return <div class={groupClass}>{allChildrenList}</div>;
  }
}
