import 'tdesign-icons-web-components/esm/components/close';
import 'tdesign-icons-web-components/esm/components/info-circle-filled';
import 'tdesign-icons-web-components/esm/components/check-circle-filled';

import { Component, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import parseTNode, { parseContentTNode } from '../_util/parseTNode';
import { StyledProps } from '../common';
import { notificationDefaultProps } from './defaultProps';
import { NotificationInstance, TdNotificationProps } from './type';

export interface NotificationProps extends NotificationInstance, TdNotificationProps, StyledProps {
  id?: string;
}

@tag('t-notification')
export default class Notification extends Component<NotificationProps> {
  static propTypes = {
    id: String,
    duration: Number,
    children: [String, Number, Object, Function],
    content: [String, Number, Object, Function],
    closeBtn: [String, Number, Object, Function],
    footer: [String, Number, Object, Function],
    label: [String, Number, Object, Function],
    icon: [String, Number, Object, Function],
    theme: String,
    title: [String, Number, Object, Function],
    value: [String, Number],
    onCloseBtnClick: Function,
    onDurationEnd: Function,
  };

  static defaultProps: TdNotificationProps = notificationDefaultProps;

  className = `${getClassPrefix()}-notification`;

  inject = ['remove'];

  notificationRef = createRef();

  timer: NodeJS.Timeout;

  ready(): void {
    const { id, className, theme } = this.props;
    this.notificationRef.current = {
      close: () => this.injection.remove(id),
    };
    // lightDOM下由root携带类名
    if ((this.constructor as any).isLightDOM) {
      this.setAttribute(
        'class',
        classname(className, this.className, {
          [`${this.className}-is-${theme}`]: theme,
        }),
      );
    }
  }

  installed(): void {
    if (this.props.duration > 0) {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.props.onDurationEnd?.();
      }, this.props.duration);
    }
  }

  uninstalled(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  renderIcon = () => {
    const { icon, theme } = this.props;

    if (typeof icon === 'boolean' && !icon) {
      return null;
    }

    const IconWrapper = ({ children }) => <div className={`${this.className}__icon`}>{children}</div>;

    if (typeof icon !== 'boolean') {
      const parseNode = parseContentTNode(icon, {});
      // 调整优先级，icon 优先级最高
      if (parseNode) {
        return <IconWrapper>{convertToLightDomNode(parseNode)}</IconWrapper>;
      }
    }

    if (theme && theme === 'success') {
      return (
        <IconWrapper>
          {convertToLightDomNode(<t-icon-check-circle-filled cls={`${getClassPrefix()}-is-success`} />)}
        </IconWrapper>
      );
    }
    if (theme && ['info', 'warning', 'error'].indexOf(theme) >= 0) {
      return (
        <IconWrapper>
          {convertToLightDomNode(<t-icon-info-circle-filled cls={`${getClassPrefix()}-is-${theme}`} />)}
        </IconWrapper>
      );
    }
    return null;
  };

  renderCloseBtn = () => {
    if (typeof this.props.closeBtn === 'boolean') {
      return (
        this.props.closeBtn &&
        convertToLightDomNode(
          <t-icon-close
            cls={`${this.className}-icon-close`}
            onClick={(e) => {
              this.props.onCloseBtnClick?.({ e });
            }}
          />,
        )
      );
    }
    return (
      <div
        className={`${this.className}-close`}
        onClick={(e) => {
          this.props.onCloseBtnClick?.({ e });
        }}
      >
        {convertToLightDomNode(parseTNode(this.props.closeBtn))}
      </div>
    );
  };

  renderContent() {
    const { title, content, footer } = this.props;

    return (
      <>
        {this.renderIcon()}
        <div className={`${this.className}__main`}>
          <div className={`${this.className}__title__wrap`}>
            <span className={`${this.className}__title`}>{title}</span>
            {this.renderCloseBtn()}
          </div>
          {content && <div className={`${this.className}__content`}>{parseTNode(content)}</div>}
          {footer && <div className={`${this.className}__detail`}>{parseTNode(footer)}</div>}
        </div>
      </>
    );
  }

  render(props: OmiProps<NotificationProps>) {
    const { className, theme, style } = props;

    if ((this.constructor as any).isLightDOM) {
      return this.renderContent();
    }
    // shadowDOM下额外渲染一层container用于渲染样式
    return (
      <div
        className={classname(className, this.className, {
          [`${this.className}-is-${theme}`]: theme,
        })}
        style={style}
      >
        {this.renderContent()}
      </div>
    );
  }
}
