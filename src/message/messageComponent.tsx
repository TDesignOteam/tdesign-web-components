import './messageClose';

import classNames from 'classnames';
import Omi, { Component, createRef, signal, tag } from 'omi';

import { StyledProps, TNode } from '../common';
import { tdClassIsGenerator, tdMessageClassGenerator, tdMessagePrefix } from './const';
import MessageIcon from './messageIcon';
// 依赖组件引入
import { TdMessageProps } from './type';

// Message 组件参数，需在 api 定义上做部分扩展
export interface MessageComponentProps extends TdMessageProps, StyledProps {
  children?: TNode;
}

// message 直接作为组件使用时
@tag('t-message')
export default class MessageComponent extends Component<MessageComponentProps> {
  static defaultProps = {
    theme: 'info',
    duration: 3000,
    icon: true,
  };

  static propTypes = {
    closeBtn: [String, Number, Object, Function],
    content: [String, Number, Object, Function],
    duration: Number,
    icon: [String, Number, Object, Function],
    theme: String,
    onClose: Function,
    onCloseBtnClick: Function,
    onDurationEnd: Function,
  };

  isHovering = signal(false);

  timer = createRef<any>();

  resetTimer = () => {
    const { duration, onDurationEnd, onClose } = this.props;
    if (duration > 0) {
      console.log(1);
      this.timer.current = setTimeout(() => {
        onDurationEnd?.();
        onClose?.({
          trigger: 'duration-end',
        });
      }, duration);
    }
  };

  clearTimer = () => {
    if (this.timer.current) {
      clearTimeout(this.timer.current);
    }
  };

  install() {
    this.resetTimer();
  }

  uninstall() {
    this.clearTimer();
  }

  render(props: Omi.OmiProps<MessageComponentProps> | MessageComponentProps) {
    const { theme, innerClass, children, innerStyle, icon = true, content, closeBtn, onCloseBtnClick, onClose } = props;
    const onCloseFn = onClose;
    const onCloseBtnClickFn = onCloseBtnClick;
    const handleCloseBtnClick = (e) => {
      onCloseBtnClickFn?.(e);
      onCloseFn?.({
        trigger: 'close-click',
      });
    };

    return (
      <div
        key="message"
        style={innerStyle}
        className={classNames(
          `${tdMessagePrefix}`,
          tdClassIsGenerator(theme),
          closeBtn ? tdClassIsGenerator('closable') : '',
          innerClass,
        )}
        onMouseEnter={this.resetTimer}
        onMouseLeave={this.clearTimer}
      >
        {icon === true ? <MessageIcon theme={theme} /> : icon}
        {content ? content : children}
        <t-message-close
          className={tdMessageClassGenerator('close')}
          closeBtn={closeBtn}
          onCloseBtnClick={handleCloseBtnClick}
        />
      </div>
    );
  }
}
