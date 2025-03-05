import './chat-content';
import '../../collapse';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';

import { isString } from 'lodash-es';
import { Component, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { TdChatItemProps } from '../type';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;
@tag('t-chat-item')
export default class ChatItem extends Component<TdChatItemProps> {
  static css = [styles];

  static propTypes = {
    actions: Array,
    name: String,
    avatar: String,
    datetime: String,
    main: Object,
    content: String,
    role: String,
    textLoading: Boolean,
    variant: String,
  };

  static defaultProps = {
    variant: 'base',
    theme: 'default',
    placement: 'left',
  };

  inject = ['messageStore'];

  private unsubscribe?: () => void;

  private messageId!: string;

  private message: TdChatItemProps;

  install() {
    this.messageId = this.props.id!;
    this.message = this.props;
    // 订阅特定消息的更新
    this.unsubscribe = this.injection?.messageStore?.subscribe(
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

  renderThinkingStatus() {
    if (!this.message.thinking) {
      return null;
    }
    if (this.message.thinking?.status === 'pending' || this.message.thinking?.status === 'streaming')
      return <div class={`${className}__think__status--pending`} part={`${className}__think__status--pending`} />;
    if (this.message.thinking?.status === 'sent')
      return convertToLightDomNode(
        <t-icon-check-circle class={`${className}__think__status--sent`} part={`${className}__think__status--sent`} />,
      );
    if (this.message.thinking?.status === 'error')
      return convertToLightDomNode(
        <t-icon-close-circle
          class={`${className}__think__status--error`}
          part={`${className}__think__status--error`}
        />,
      );
    return null;
  }

  // 思维链
  renderThinking() {
    const { thinking } = this.message;

    if (!thinking?.content) {
      return null;
    }
    return (
      <t-collapse className={`${className}__think`} expandIconPlacement="right" defaultExpandAll>
        {convertToLightDomNode(
          <t-collapse-panel
            className={`${className}__think__content`}
            header={
              <>
                {this.renderThinkingStatus()}
                {thinking.title || '思考中...'}
              </>
            }
            content={thinking.content}
          />,
        )}
      </t-collapse>
    );
  }

  render(props: TdChatItemProps) {
    const { textLoading, role, variant, theme, placement } = props;
    console.log('===item render', this.messageId);

    const baseClass = `${className}__inner`;
    const roleClass = role;
    const variantClass = variant ? `${className}--variant--${variant}` : '';
    const themeClass = theme ? `${className}--theme--${theme}` : '';
    const placementClass = placement;

    return (
      <div className={classname(baseClass, roleClass, variantClass, themeClass, placementClass)}>
        {this.renderAvatar()}
        <div class={`${className}__main`}>
          <div class={classname(`${className}__content`, `${className}__content--base`)}>
            <div class={`${className}__header`}>
              <slot name="intro"></slot>
            </div>

            {/* TODO: 骨架屏加载 */}
            {/* {textLoading && <t-skeleton loading={textLoading} animation={'gradient'}></t-skeleton>} */}
            {/* 动画加载 skeleton：骨架屏 gradient：渐变加载动画一个点 dot：三个点 */}
            {/* {textLoading && movable && <ChatLoading loading={textLoading} animation={'gradient'}></ChatLoading>} */}
            {/* TODO: 样式 */}
            {this.renderThinking()}
            {this.message?.search?.content && (
              <div className={`${className}__search`}>{this.message.search.content}</div>
            )}
            {!textLoading && this.message?.main?.content && (
              <div className={`${className}__detail`}>
                {/* {isArray(content) ? content : <t-chat-content isNormalText={true} content={content} role={role} />} */}
                <t-chat-content content={this.message.main.content} role={role}></t-chat-content>
              </div>
            )}
            <div className={`${className}__actions-margin`}>
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleAction = (action: any, index: number) => {
    this.fire('action', { action, index });
  };
}
