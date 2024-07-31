import { classNames, Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname.ts';
import { StyledProps } from '../common';
import { TdBadgeProps } from './type.ts';

export interface BadgeProps extends TdBadgeProps, StyledProps {}

const MIN_COUNT = 1;

@tag('t-badge')
export default class Badge extends Component<BadgeProps> {
  static css = [];

  static defaultProps = {
    color: '',
    count: 0,
    dot: false,
    maxCount: 99,
    shape: 'circle',
    showZero: false,
    size: 'medium',
  };

  static propTypes = {
    ignoreAttributes: Object,
  };

  nodeRef = createRef<HTMLElement>();

  classPrefix = getClassPrefix();

  getDisplayCount = () => {
    const { count, maxCount } = this.props;
    if (typeof count === 'number' && count > maxCount) {
      return `${maxCount}+`;
    }
    return count;
  };

  getStyle = () => {
    const { style, color, offset } = this.props;
    const mergedStyle = { ...style };
    if (color) {
      mergedStyle.backgroundColor = color;
    }
    if (offset) {
      if (offset[0]) {
        mergedStyle.right = +offset[0];
      }
      if (offset[1]) {
        mergedStyle.marginTop = +offset[1];
      }
    }
    return mergedStyle;
  };

  render(props: BadgeProps) {
    const { children, content, count, dot, shape, showZero, size, className, ignoreAttributes, ...restProps } = props;
    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }

    const childNode = content || children;

    const badgeClassName = classNames(
      !childNode && `${this.classPrefix}-badge--static`,
      dot ? `${this.classPrefix}-badge--dot` : `${this.classPrefix}-badge--${shape}`,
      size === 'small' && `${this.classPrefix}-size-s`,
      !childNode && className,
    );

    let isHidden = !count;
    if (typeof count === 'number') {
      isHidden = count < MIN_COUNT && !showZero;
    }

    const badge = !isHidden ? (
      <span {...(childNode ? {} : restProps)} className={badgeClassName} style={this.getStyle()}>
        {!dot ? this.getDisplayCount() : null}
      </span>
    ) : null;

    if (!childNode) {
      return badge;
    }

    return (
      <span {...restProps} className={classNames(`${this.classPrefix}-badge`, className)} ref={this.nodeRef}>
        {childNode}
        {badge}
      </span>
    );
  }
}
