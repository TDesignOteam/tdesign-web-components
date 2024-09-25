import './dropdownItem';
import './dropdownMenu';
import '../popup';

import { isFunction } from 'lodash';
import omit from 'lodash/omit';
import { Component, css, tag } from 'omi';

import classNames, { getClassPrefix } from '../_util/classname';
import { StyledProps, TNode } from '../common';
import { PopupVisibleChangeContext } from '../popup';
import { dropdownDefaultProps } from './defaultProps';
import { propTypes } from './dropdownMenu';
import getDropdownOptions from './getDropdownOptions';
import { DropdownOption, TdDropdownProps } from './type';

export interface DropdownProps extends TdDropdownProps, StyledProps {
  children?: TNode;
}

@tag('t-dropdown')
export default class Dropdown extends Component<DropdownProps> {
  static css = [
    css`
      .${getClassPrefix()}-dropdown {
        padding: 0;
      }
    `,
  ];

  static defaultProps = dropdownDefaultProps;

  static propTypes = propTypes;

  isPopupVisible = false;

  options: DropdownOption[] = [];

  handleMenuClick = (data: DropdownOption, context: { e: MouseEvent }) => {
    if (this.props.hideAfterItemClick) {
      this.isPopupVisible = false;
      this.props.popupProps?.onVisibleChange?.(false, context);
    }
    this.props.onClick?.(data, context);
    this.update();
  };

  handleVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
    if (this.props.disabled || !this.options.length) return;
    this.isPopupVisible = visible;
    this.props.popupProps?.onVisibleChange?.(visible, context);
    this.update();
  };

  install(): void {
    this.options = getDropdownOptions(this.props.children as TNode[], this.props.options);
  }

  beforeUpdate() {
    this.options = getDropdownOptions(this.props.children as TNode[], this.props.options);
  }

  getOverlayInnerStyle = () => {
    const { popupProps } = this.props;
    if (!popupProps?.overlayInnerStyle) return { padding: 0 };
    if (isFunction(popupProps.overlayInnerStyle)) {
      return (triggerElement: HTMLElement, popupElement: HTMLElement) => ({
        padding: 0,
        ...(popupProps as any).overlayInnerStyle(triggerElement, popupElement),
      });
    }
    return {
      padding: 0,
      ...(popupProps?.overlayInnerStyle || {}),
    };
  };

  render(props: DropdownProps) {
    const { popupProps = {}, disabled, placement, trigger, innerClass, children, innerStyle } = props;

    const renderContent = <t-dropdown-menu {...props} options={this.options} onClick={this.handleMenuClick} />;

    const popupParams = {
      disabled,
      placement,
      trigger,
      showArrow: false,
      content: renderContent,
      ...omit(popupProps, 'onVisibleChange'),
      overlayInnerClassName: classNames(`${getClassPrefix()}-dropdown`, popupProps?.overlayInnerClassName),
      overlayInnerStyle: this.getOverlayInnerStyle(),
    };

    return (
      <t-popup
        expandAnimation={false}
        // destroyOnClose={true}
        visible={this.isPopupVisible}
        onVisibleChange={this.handleVisibleChange}
        innerClass={innerClass}
        innerStyle={innerStyle}
        {...popupParams}
      >
        {children?.[0]}
      </t-popup>
    );
  }
}
