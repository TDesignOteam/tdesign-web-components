import { Component, tag, VNode } from 'omi';

import { classname, getClassPrefix } from '../utils';

type Theme = 'default' | 'primary' | 'danger' | 'warning' | 'success';
type Variant = 'base' | 'outline' | 'dashed' | 'text';

export interface ButtonProps {
  tag: string;
  className?: string;
  block?: boolean;
  disabled?: boolean;
  ghost?: boolean;
  icon?: VNode;
  loading?: boolean;
  shape?: 'rectangle' | 'square' | 'round' | 'circle';
  size?: 'small' | 'medium' | 'large';
  type?: 'submit' | 'reset' | 'button';
  variant?: Variant;
  theme?: Theme;
  href?: string;
  onClick?: (e: MouseEvent) => void;
}

@tag('t-button')
export default class Button extends Component<ButtonProps> {
  static css = [];

  constructor() {
    super();
    this.props = {
      variant: 'base',
      size: 'medium',
      shape: 'rectangle',
      loading: false,
      ghost: false,
      disabled: false,
      block: false,
      ...this.props,
    };
  }

  static defaultProps = {
    tag: 'button',
  };

  get tag() {
    const { tag, href, disabled } = this.props;
    if (!tag && href && !disabled) return 'a';
    if (!tag && disabled) return 'div';
    return tag || 'button';
  }

  get theme() {
    const { theme, variant } = this.props;
    if (!theme) {
      if (variant === 'base') return 'primary';
      return 'default';
    }
    return theme;
  }

  render() {
    const {
      tag: Tag,
      icon,
      className,
      variant,
      size,
      block,
      disabled,
      ghost,
      loading,
      shape,
      onClick,
      ...props
    } = this.props;

    const classPrefix = getClassPrefix();

    let iconNode = icon;
    if (loading) iconNode = <t-icon className="mb-[2px]" name={'loading'} />;

    return (
      <Tag
        className={classname(
          className,
          [
            `${classPrefix}-button`,
            `${classPrefix}-button--theme-${this.theme}`,
            `${classPrefix}-button--variant-${variant}`,
          ],
          {
            [`${classPrefix}-button--shape-${shape}`]: shape !== 'rectangle',
            [`${classPrefix}-button--ghost`]: ghost,
            [`${classPrefix}-is-loading`]: loading,
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-size-s`]: size === 'small',
            [`${classPrefix}-size-l`]: size === 'large',
            [`${classPrefix}-size-full-width`]: block,
          },
        )}
        onClick={!disabled && !loading ? onClick : undefined}
        {...props}
      >
        {iconNode ? iconNode : null}
        <span className={`${classPrefix}-button__text`}>
          <slot></slot>
        </span>
      </Tag>
    );
  }
}
