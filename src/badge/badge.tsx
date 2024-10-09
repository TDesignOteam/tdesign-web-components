import { classNames, Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname.ts';
import { StyledProps, Styles } from '../common';
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
    children: [String, Number, Object, Function],
    color: String,
    content: [String, Number, Object, Function],
    count: [String, Number, Object, Function],
    dot: Boolean,
    maxCount: Number,
    offset: Object,
    shape: String,
    showZero: Boolean,
    size: String,
    ignoreAttributes: Object,
  };

  nodeRef = createRef<HTMLElement>();

  classPrefix = getClassPrefix();

  getDisplayCount = () => {
    // 数量展示逻辑
    const { count, maxCount } = this.props;
    if (typeof count === 'number' && count > maxCount) {
      return `${maxCount}+`;
    }
    return count;
  };

  getStyle = (styles: Styles) => {
    // 红点偏移逻辑
    const { color, offset } = this.props;
    const mergedStyle = { ...styles };
    if (color) {
      mergedStyle.backgroundColor = color;
    }
    if (offset) {
      if (offset[0]) {
        mergedStyle.marginRight = +offset[0];
      }
      if (offset[1]) {
        mergedStyle.marginTop = +offset[1];
      }
    }
    return mergedStyle;
  };

  render(props: BadgeProps) {
    const {
      children,
      content,
      count,
      dot,
      shape,
      showZero,
      size,
      ignoreAttributes,
      innerStyle,
      innerClass,
      ...restProps
    } = props;

    delete restProps.style;
    delete restProps.className;

    // 去除父元素属性
    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }
    // 初始化变量-所需要展示的childNode、获取样式所需的类名badgeClassName
    const childNode = content || children;
    const badgeClassName = classNames(
      !childNode && `${this.classPrefix}-badge--static`,
      dot ? `${this.classPrefix}-badge--dot` : `${this.classPrefix}-badge--${shape}`,
      size === 'small' && `${this.classPrefix}-size-s`,
      !childNode && innerClass,
    );

    // 隐藏逻辑
    let isHidden = !count;
    if (typeof count === 'number') {
      isHidden = count < MIN_COUNT && !showZero;
    }
    const badge = !isHidden ? (
      <span
        {...(childNode ? {} : restProps)}
        className={badgeClassName}
        style={this.getStyle(childNode ? {} : innerStyle)}
      >
        {!dot ? this.getDisplayCount() : null}
      </span>
    ) : null;

    if (!childNode) {
      return badge;
    }
    return (
      <span
        {...restProps}
        className={classNames(`${this.classPrefix}-badge`, innerClass)}
        style={innerStyle}
        ref={this.nodeRef}
      >
        {childNode}
        {badge}
      </span>
    );
  }
}
