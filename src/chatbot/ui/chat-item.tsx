import './chat-content';

import { isString } from 'lodash-es';
import { Component, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import type { TdChatItemProps } from '../type';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat`;
@tag('t-chat-item')
export default class ChatItem extends Component<TdChatItemProps> {
  static css = [styles];

  static propTypes = {
    actions: Array,
    name: String,
    avatar: String,
    datetime: String,
    content: String,
    role: String,
    textLoading: Boolean,
    variant: String,
  };

  inject = ['messageStore'];

  private unsubscribe?: () => void;

  private messageId!: string;

  private message: TdChatItemProps;

  install() {
    this.messageId = this.props.id!;
    this.message = this.props;
    // 订阅特定消息的更新
    this.unsubscribe = this.injection.messageStore.subscribe(
      (state) => {
        this.message = {
          ...this.message,
          ...state.messages[this.messageId],
        };
        this.update();
      },
      [`messages.${this.messageId}`],
    );
  }

  receiveProps(
    props: TdChatItemProps | OmiProps<TdChatItemProps, any>,
    oldProps: TdChatItemProps | OmiProps<TdChatItemProps, any>,
  ) {
    if (props?.main?.content === oldProps?.main?.content) {
      return false;
    }
    return true;
  }

  uninstall() {
    this.unsubscribe?.();
  }

  renderAvatar() {
    if (!this.props.avatar) {
      return null;
    }
    return (
      <div class={`${className}__avatar`}>
        <div class={`${className}__avatar__box`}>
          {isString(this.props.avatar) ? (
            <img src={this.props.avatar} alt="avatar" class={`${className}__avatar-image`} />
          ) : (
            this.props.avatar
          )}
        </div>
      </div>
    );
  }

  render(props: TdChatItemProps) {
    const { textLoading, role, variant } = props;
    console.log('===item render', props.id);

    const baseClass = `${className}__inner`;
    const roleClass = role;
    const variantClass = variant ? `${className}__text--variant--${variant}` : '';

    return (
      <div className={classname(baseClass, roleClass, variantClass)}>
        {this.renderAvatar()}
        <div class={classname(`${className}__content`, `${className}__content--base`)}>
          <div class={`${className}__base`}>
            <slot name="intro"></slot>
          </div>

          {/* TODO: 骨架屏加载 */}
          {/* {textLoading && <t-skeleton loading={textLoading} animation={'gradient'}></t-skeleton>} */}
          {/* 动画加载 skeleton：骨架屏 gradient：渐变加载动画一个点 dot：三个点 */}
          {/* {textLoading && movable && <ChatLoading loading={textLoading} animation={'gradient'}></ChatLoading>} */}
          {/* TODO: 样式 */}
          {this.message?.thinking?.content && <div class={`${className}__think`}>{this.message.thinking.content}</div>}
          {!textLoading && this.message?.main?.content && (
            <div class={`${className}__detail`}>
              {/* {isArray(content) ? content : <t-chat-content isNormalText={true} content={content} role={role} />} */}
              {this.message.main.content}
            </div>
          )}
          <div class={`${className}__actions-margin`}>
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    );
  }

  private handleAction = (action: any, index: number) => {
    this.fire('action', { action, index });
  };
}
