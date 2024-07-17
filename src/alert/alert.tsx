import 'tdesign-icons-web-components/esm/components/check-circle-filled';
import 'tdesign-icons-web-components/esm/components/info-circle-filled';
import 'tdesign-icons-web-components/esm/components/error-circle-filled';
import 'tdesign-icons-web-components/esm/components/close';

import { isObject } from 'lodash';
import { Component, createRef, signal, SignalValue, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname.ts';
import parseTNode from '../_util/parseTNode.ts';
import { StyledProps } from '../common';
import { styleSheet } from './style';
import { TdAlertProps } from './type.ts';

export interface AlertProps extends TdAlertProps, StyledProps {}

const expandText = '展开更多';

const collapseText = '收起';

@tag('t-alert')
export default class Alert extends Component<AlertProps> {
  static css = styleSheet;

  static defaultProps = {
    close: false,
    maxLine: 0,
    theme: 'info',
  };

  static propTypes = {
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
    success: <t-icon-check-circle-filled />,
    info: <t-icon-info-circle-filled />,
    error: <t-icon-error-circle-filled />,
    warning: <t-icon-error-circle-filled />,
  };

  closed: SignalValue<boolean> = signal(false);

  collapsed: SignalValue<boolean> = signal(true);

  nodeRef = createRef<HTMLElement>();

  classPrefix = getClassPrefix();

  handleClose(e?: MouseEvent) {
    const { onClose } = { ...this.props };
    this.nodeRef.current?.classList.add(`${this.classPrefix}-alert--closing`);
    onClose?.({ e });
  }

  handleCloseEnd(e?: TransitionEvent) {
    const { onClosed } = { ...this.props };
    const isTransitionTarget = e?.target === this.nodeRef.current;
    // 防止子元素冒泡触发
    if (e?.propertyName === 'opacity' && isTransitionTarget) {
      this.closed.value = true;
      onClosed?.({ e });
    }
  }

  handleCollapse() {
    this.collapsed.value = !this.collapsed.value;
  }

  renderTitle() {
    const { title } = { ...this.props };
    return title ? <div className={`${this.classPrefix}-alert__title`}>{title}</div> : null;
  }

  renderMessage() {
    const { maxLine, message } = { ...this.props };
    const handleCollapse = this.handleCollapse.bind(this);
    if (maxLine > 0 && Array.isArray(message)) {
      return (
        <div className={`${this.classPrefix}-alert__description`}>
          {message.map((item, index) => {
            if (this.collapsed.value) {
              if (index < maxLine) {
                return <div key={index}>{item}</div>;
              }
              return null;
            }
            return <div key={index}>{item}</div>;
          })}
          <div className={`${this.classPrefix}-alert__collapse`} onClick={handleCollapse}>
            {this.collapsed.value ? expandText : collapseText}
          </div>
        </div>
      );
    }
    return <div className={`${this.classPrefix}-alert__description`}>{message}</div>;
  }

  renderIcon() {
    const { icon, theme } = { ...this.props };
    if (isObject(icon)) return icon;
    return <div class={`${this.classPrefix}-alert__icon`}>{this.iconMap[theme] || this.iconMap.info}</div>;
  }

  renderClose() {
    const { close } = { ...this.props };
    const handleClose = this.handleClose.bind(this);
    return (
      <div className={`${this.classPrefix}-alert__close`} onClick={handleClose}>
        {typeof close === 'boolean' && close ? <t-icon-close /> : parseTNode(close)}
      </div>
    );
  }

  renderOperation() {
    const { operation } = { ...this.props };
    if (operation) {
      return <div className={`${this.classPrefix}-alert__operation`}>{parseTNode(operation)}</div>;
    }
  }

  renderContext() {
    return (
      <div className={`${this.classPrefix}-alert__content`}>
        {this.renderTitle()}
        <div className={`${this.classPrefix}-alert__message`}>
          {this.renderMessage()}
          {this.renderOperation()}
        </div>
      </div>
    );
  }

  ready() {
    const handleCloseEnd = this.handleCloseEnd.bind(this);
    this.nodeRef.current?.addEventListener('transitionend', handleCloseEnd);
  }

  render(props: AlertProps) {
    const { className, style, theme, ignoreAttributes } = { ...props };
    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }
    const cls = classname([
      `${this.classPrefix}-alert`,
      `${this.classPrefix}-alert--${theme}`,
      {
        [`${this.classPrefix}-is-hidden`]: this.closed.value,
      },
      className,
    ]);
    return (
      <div ref={this.nodeRef} className={cls} style={style}>
        {this.renderIcon()}
        {this.renderContext()}
        {this.renderClose()}
      </div>
    );
  }
}
