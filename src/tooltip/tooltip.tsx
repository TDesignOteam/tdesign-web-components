import '../popup';

import { Component, createElement, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { type PopupVisibleChangeContext } from '../popup';
import { defaultProps as popupDefaultProps } from '../popup/popup';
import { PopupTypes } from '../popup/popup';
import { TdTooltipProps } from './type';

export interface TooltipProps extends TdTooltipProps, StyledProps {}

export const tooltipDefaultProps: TooltipProps = {
  ...popupDefaultProps,
  destroyOnClose: true,
  placement: 'top',
  showArrow: true,
  theme: 'default',
  duration: 0,
};

@tag('t-tooltip')
export default class Tooltip extends Component<TooltipProps> {
  static defaultProps = tooltipDefaultProps;

  static propTypes = {
    ...PopupTypes,
    delay: Number,
    destroyOnClose: Boolean,
    duration: Number,
    placement: String,
    showArrow: Boolean,
    theme: String,
    ignoreAttributes: Array,
  };

  popupRef = createRef();

  timerRef = createRef();

  timeUp = false;

  popupVisible = undefined;

  handleVisibleChange(visible: boolean, { e, trigger }: PopupVisibleChangeContext) {
    this.props?.onVisibleChange?.(visible, { e, trigger });
  }

  countDown(props: TooltipProps) {
    if (props.duration !== 0 && !this.timeUp) {
      this.timeUp = true;
      this.popupVisible = true;
      this.update();
      clearTimeout(this.timerRef.current as number);
      this.timerRef.current = window.setTimeout(() => {
        this.popupVisible = undefined;
        this.timeUp = false;
        this.update();
      }, props.duration);
    }
  }

  receiveProps(props: TooltipProps, old: TooltipProps) {
    if (props.duration !== old.duration) {
      this.countDown(props);
    }

    return true;
  }

  installed(): void {
    this.countDown(this.props);
  }

  uninstall(): void {
    if (this.timerRef.current) {
      clearTimeout(this.timerRef.current as number);
    }
  }

  render(props: TooltipProps | OmiProps<TooltipProps, any>): JSX.Element {
    const { destroyOnClose, showArrow, theme, placement, overlayClassName, ignoreAttributes, children, ...restProps } =
      props;
    const classPrefix = getClassPrefix();
    const toolTipClass = classname(
      `${classPrefix}-tooltip`,
      {
        [`${classPrefix}-tooltip--${theme}`]: theme,
      },
      overlayClassName,
    );

    delete restProps.onVisibleChange;
    delete restProps.duration;
    delete restProps.className;
    delete restProps.style;

    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }

    return createElement(
      't-popup',
      {
        visible: this.popupVisible,
        destroyOnClose,
        showArrow,
        overlayClassName: toolTipClass,
        onVisibleChange: this.handleVisibleChange,
        placement,
        ...restProps,
        ref: this.popupRef,
      },
      children,
    );
  }
}
