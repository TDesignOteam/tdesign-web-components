import 'tdesign-icons-web-components/esm/components/loading';

import { Component, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { StyledProps } from '../common';
import { TdButtonProps } from './type';

export interface ButtonProps extends TdButtonProps, StyledProps {}

@tag('t-button')
export default class Button extends Component<ButtonProps> {
  static css = [];

  static defaultProps = {
    tag: 'button',
    variant: 'base',
    size: 'medium',
    shape: 'rectangle',
    loading: false,
    ghost: false,
    disabled: false,
    block: false,
    ignoreAttributes: [],
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

  render(props: ButtonProps) {
    const {
      icon,
      className,
      variant,
      size,
      block,
      disabled,
      ghost,
      loading,
      shape,
      ignoreAttributes,
      onClick,
      ...rest
    } = props;

    const classPrefix = getClassPrefix();

    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }

    let iconNode = convertToLightDomNode(icon);
    if (loading) iconNode = convertToLightDomNode(<t-icon-loading className="mr-[2px]" />);

    const Tag = this.tag as string;
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
        {...rest}
      >
        {iconNode ? iconNode : null}
        <span className={`${classPrefix}-button__text`}>
          <slot></slot>
        </span>
      </Tag>
    );
  }
}
