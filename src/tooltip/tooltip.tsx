import '../popup';

import { Component, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { type PopupVisibleChangeContext } from '../popup';
import { PopupTypes } from '../popup/popup';
import { TdTooltipProps } from './type';

export type TooltipProps = TdTooltipProps;

export const tooltipDefaultProps: TooltipProps = {
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
    const { destroyOnClose, showArrow, theme, placement, overlayClassName, ignoreAttributes, ...restProps } = props;
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
    delete restProps.children;

    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }

    return (
      <t-popup
        ref={this.popupRef}
        visible={this.popupVisible}
        destroyOnClose={destroyOnClose}
        showArrow={showArrow}
        overlayClassName={toolTipClass}
        onVisibleChange={this.handleVisibleChange}
        placement={placement}
        {...restProps}
      >
        <slot></slot>
      </t-popup>
    );
  }
}
