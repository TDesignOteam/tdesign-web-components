import './avatar';

import { toArray } from 'lodash';
import { classNames, cloneElement, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import { styleSheet } from './style/index.ts';
import { TdAvatarGroupProps } from './type';

import borderCss from './style/border.less';
import offsetLeftCss from './style/offset_left.less';
import offsetLeftZIndexCss from './style/offset_left_zIndex.less';
import offsetRightCss from './style/offset_right.less';

export interface AvatarGroupProps extends TdAvatarGroupProps, StyledProps {}

@tag('t-avatar-group')
export default class AvatarGroup extends Component<AvatarGroupProps> {
  static css = styleSheet;

  static defaultProps = { cascading: 'right-up' };

  static propTypes = {
    cascading: String,
    max: Number,
    size: String,
    collapseAvatar: Object,
    children: Object,
  };

  preClass = `${getClassPrefix()}-avatar`;

  allChildrenList: any;

  provide = { groupSize: undefined as any };

  install() {
    this.provide = { groupSize: this.props.size };
  }

  render(props: OmiProps<AvatarGroupProps, any>) {
    const { preClass } = this;
    const { children, max, cascading, collapseAvatar } = props;
    const childrenList = toArray(children);
    if (childrenList.length > 0) {
      this.allChildrenList = childrenList.map((child, index) => {
        let childrenCss = borderCss;
        if (cascading === 'right-up' && index !== childrenList.length - 1) {
          childrenCss += offsetRightCss;
        } else if (cascading === 'left-up' && index !== 0) {
          childrenCss += offsetLeftCss + offsetLeftZIndexCss;
        } else if (cascading === 'left-up') {
          childrenCss += offsetLeftZIndexCss;
        }

        return cloneElement(child, {
          key: `avatar-group-item-${index}`,
          css: childrenCss,
        });
      });
    }
    const groupClass = classNames(`${preClass}-group`, this.className, {
      [`${preClass}--offset-right`]: cascading === 'right-up',
      [`${preClass}--offset-left`]: cascading === 'left-up',
    });

    const childrenCount = childrenList.length;
    if (props.max && childrenCount > max) {
      const showList = this.allChildrenList.slice(0, max);
      let childrenCss = borderCss;
      if (cascading === 'left-up') {
        childrenCss += offsetLeftCss + offsetLeftZIndexCss;
      }
      const ellipsisAvatar = (
        <t-avatar css={childrenCss}>{parseTNode(collapseAvatar) || `+${childrenCount - max}`} </t-avatar>
      );
      showList.push(<div key="t-avatar__collapse">{ellipsisAvatar}</div>);
      return <div class={groupClass}>{showList}</div>;
    }
    return <div class={groupClass}>{this.allChildrenList}</div>;
  }
}
