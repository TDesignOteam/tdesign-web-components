import 'tdesign-icons-web-components/esm/components/loading';

import { Component, createRef, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { flexIcon } from '../_util/icon';
import { convertToLightDomNode } from '../_util/lightDom';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import { TdButtonProps } from './type';

export interface ButtonProps extends TdButtonProps, StyledProps {}

@tag('t-button')
export default class Button extends Component<ButtonProps> {
  static css = [];

  static propTypes = {
    children: [Function, Object, String, Number],
    theme: String,
    type: String,
    variant: String,
    size: String,
    shape: String,
    icon: Object,
    loading: Boolean,
    ghost: Boolean,
    block: Boolean,
    disabled: Boolean,
    href: String,
    tag: String,
    content: [String, Object],
    onClick: Function,
    ignoreAttributes: Array,
    innerStyle: String,
  };

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

  slotRef = createRef<HTMLElement>();

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

  installed() {
    this.slotRef.current?.addEventListener('click', (e: Event) => {
      if (this.props.disabled || this.props.loading) {
        e.stopPropagation();
      }
    });
    this.slotRef.current?.addEventListener('touchstart', () => {});
  }

  render(props: ButtonProps) {
    const {
      icon,
      variant,
      size,
      block,
      disabled,
      ghost,
      loading,
      shape,
      ignoreAttributes,
      suffix,
      innerClass,
      innerStyle,
      ...rest
    } = props;

    delete rest.children;
    delete rest.onClick;
    delete rest.className;
    delete rest.style;

    const classPrefix = getClassPrefix();

    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }

    let iconNode = convertToLightDomNode(flexIcon(icon));
    if (loading) iconNode = convertToLightDomNode(flexIcon(<t-icon-loading className="mr-[2px]" />));

    const Tag = this.tag as string;
    return (
      <Tag
        className={classname(
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
          innerClass,
        )}
        style={innerStyle}
        ref={this.slotRef}
        {...rest}
      >
        {iconNode ? iconNode : null}
        <span className={`${classPrefix}-button__text`}>
          <slot></slot>
        </span>
        {suffix && <span className={`${classPrefix}-button__suffix`}>{parseTNode(suffix)}</span>}
      </Tag>
    );
  }
}
