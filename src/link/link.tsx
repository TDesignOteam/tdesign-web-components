import { Component, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import { TdLinkProps } from './type';

export interface LinkProps extends TdLinkProps, StyledProps {}
@tag('t-link')
export default class Link extends Component<LinkProps> {
  static propTypes = {
    underline: Boolean,
    theme: String,
    disabled: Boolean,
    hover: Boolean,
    size: String,
    prefixIcon: String,
    suffixIcon: String,
    href: String,
    onClick: Function,
    content: String,
  };

  static defaultProps = {
    hover: 'underline',
    size: 'medium',
    theme: 'default',
  };

  linkRef = createRef<any>();

  render(props: OmiProps<LinkProps>) {
    const {
      children,
      content,
      className,
      underline,
      prefixIcon,
      suffixIcon,
      theme,
      disabled,
      hover,
      onClick,
      href,
      size,
      ...otherProps
    } = props;
    const classPrefix = getClassPrefix();

    const handleClick = (e: MouseEvent) => {
      if (disabled) {
        return;
      }
      onClick?.(e);
    };
    return (
      <a
        {...otherProps}
        href={disabled || !href ? undefined : href}
        ref={this.linkRef}
        className={classname(className, [`${classPrefix}-link`, `${classPrefix}-link--theme-${theme}`], {
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-is-disabled`]: !!disabled,
          [`${classPrefix}-is-underline`]: !!underline,
          [`${classPrefix}-link--hover-${hover}`]: !disabled,
        })}
        onClick={handleClick}
      >
        {prefixIcon && (
          <span className={classname([`${classPrefix}-link__prefix-icon`])}>{parseTNode(prefixIcon)}</span>
        )}
        {content || children}
        {suffixIcon && (
          <span className={classname([`${classPrefix}-link__suffix-icon`])}>{parseTNode(suffixIcon)}</span>
        )}
      </a>
    );
  }
}
