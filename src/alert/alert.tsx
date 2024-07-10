import Omi, { Component, signal } from 'omi';

import classname, { getClassPrefix } from '../_util/classname.ts';
import { StyledProps } from '../common';
import { TdAlertProps } from './type.ts';

export interface AlertProps extends TdAlertProps, StyledProps {}

export default class Alert extends Component<AlertProps> {
  static css = [];

  static defaultProps = {
    close: false,
    maxLine: 0,
    theme: 'info',
  };

  static propsStyle = {
    close: Object,
    icon: Object,
    maxLine: Number,
    message: Object,
    operation: Object,
    theme: String,
    title: Object,
    onClose: Function,
    onClick: Function,
    ignoreAttributes: Object,
  };

  iconMap = {
    success: 'check-circle-filled',
    info: 'info-circle-filled',
    error: 'error-circle-filled',
    warning: 'error-circle-filled',
  };

  classPrefix = getClassPrefix();

  closed = signal(false);

  collapsed = signal(false);

  handleClose(e: MouseEvent) {
    const { onClose } = { ...this.props };
    this.closed.value = true;
    onClose?.({ e });
  }

  handleCollapse() {
    this.collapsed.value = !this.collapsed.value;
  }

  renderTitle() {
    return <></>;
  }

  renderMessage() {
    return <></>;
  }

  renderContent() {
    return (
      <div class={`${this.classPrefix}__content`}>
        {this.renderTitle()}
        {this.renderMessage()}
      </div>
    );
  }

  renderIcon() {
    const { icon, theme } = { ...this.props };
    let iconContent;
    if (icon) {
      iconContent = icon;
    } else {
      iconContent = <i class={`${this.classPrefix}-alert__icon--${this.iconMap[theme]}`}></i>;
    }
    return <div className={`${this.classPrefix}-alert__icon`}>{iconContent}</div>;
  }

  renderClose() {
    return <></>;
  }

  render(props: Omi.OmiProps<AlertProps> | AlertProps) {
    const {
      // className,
      // style,
      // close,
      // icon,
      // maxLine,
      // message,
      // operation,
      theme,
      // title,
      // onClose,
      // onClosed,
      ignoreAttributes,
    } = { ...props };
    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }
    const cls = classname([
      this.classPrefix,
      `${this.classPrefix}--${theme}`,
      {
        [`${this.classPrefix}-is-hidden`]: !this.closed.value,
      },
    ]);
    return (
      <div class={cls}>
        {this.renderIcon()}
        {this.renderContent()}
        {this.renderClose()}
      </div>
    );
  }
}
