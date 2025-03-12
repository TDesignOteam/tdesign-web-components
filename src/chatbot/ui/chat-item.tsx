import './chat-content';
import '../../collapse';
import '../../skeleton';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';
import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';

import { isString } from 'lodash-es';
import { Component, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import { MessagePlugin } from '../../message';
import { isAIMessage, isUserMessage } from '../core/type';
import type { TdChatItemAction, TdChatItemProps } from '../type';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

@tag('t-chat-item')
export default class ChatItem extends Component<TdChatItemProps> {
  static css = [styles];

  static propTypes = {
    actions: [Array, Function, Boolean],
    name: String,
    avatar: String,
    datetime: String,
    main: Object,
    content: String,
    role: String,
    status: String,
    textLoading: Boolean,
    variant: String,
  };

  static defaultProps = {
    variant: 'base',
    placement: 'left',
  };

  private messageId!: string;

  clickCopyHandler = () => {
    if (this.props.message?.role !== 'assistant') {
      return;
    }
    const copyContent = this.props.message.main.content;

    navigator.clipboard
      .writeText(copyContent.toString())
      .then(() => {
        MessagePlugin.success('复制成功');
      })
      .catch(() => {
        MessagePlugin.success('复制失败，请手动复制');
      });
  };

  install() {
    this.messageId = this.props.message.id!;
  }

  receiveProps(
    props: TdChatItemProps | OmiProps<TdChatItemProps, any>,
    oldProps: TdChatItemProps | OmiProps<TdChatItemProps, any>,
  ) {
    const newMsg = props?.message;
    const oldMsg = oldProps?.message;

    // 处理用户消息
    if (isUserMessage(newMsg) && isUserMessage(oldMsg) && newMsg.content === oldMsg.content) {
      return false;
    }
    // 处理AI消息
    if (
      isAIMessage(newMsg) &&
      isAIMessage(oldMsg) &&
      newMsg.main?.content === oldMsg.main?.content &&
      newMsg.thinking?.content === oldMsg.thinking?.content
    ) {
      return false;
    }

    return true;
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

  presetActions: TdChatItemAction[] = [
    { name: 'refresh', render: <t-icon-refresh />, status: ['complete'] },
    {
      name: 'copy',
      render: (
        <div class={`${className}__actions__preset__wrapper`} onClick={this.clickCopyHandler}>
          <t-icon-copy />
        </div>
      ),
    },
  ];

  renderActions() {
    const { actions, message } = this.props;
    if (!actions) {
      return null;
    }
    let arrayActions: TdChatItemAction[] = Array.isArray(actions) ? actions : this.presetActions;
    if (typeof actions === 'function') {
      arrayActions = actions(this.presetActions);
    }

    return arrayActions.map((item, idx) => {
      // 默认消息完成时才展示action
      if (!item.status && message.status !== 'complete') {
        return null;
      }
      if (item.status && !item.status.includes(message.status)) {
        return null;
      }
      return (
        <span
          key={item.name}
          class={`${className}__actions__item__wrapper`}
          onClick={() => this.handleAction(item.name, idx)}
        >
          {item.render}
        </span>
      );
    });
  }

  get renderMessageStatus() {
    if (!isAIMessage(this.props.message)) return;
    const { status, thinking, search, main } = this.props.message;
    // 如果有任一内容，就不用展示message整体状态
    if (thinking?.content || search?.content || main?.content) {
      return null;
    }
    if (status === 'stop' || status === 'complete') {
      return '已终止';
    }
    if (status === 'error') {
      return '出错了';
    }
    return (
      <t-skeleton class={`${className}__skeleton`} loading={true} theme="paragraph" animation="gradient"></t-skeleton>
    );
  }

  renderThinkingStatus() {
    if (!isAIMessage(this.props.message)) return;
    const { thinking, status } = this.props.message;

    if (thinking?.status === 'complete' || thinking?.status === 'stop' || status === 'stop')
      return convertToLightDomNode(
        <t-icon-check-circle
          class={`${className}__think__status--complete`}
          part={`${className}__think__status--complete`}
        />,
      );
    if (thinking?.status === 'error')
      return convertToLightDomNode(
        <t-icon-close-circle
          class={`${className}__think__status--error`}
          part={`${className}__think__status--error`}
        />,
      );
    return (
      <div class={`${className}__think__status--pending`} part={`${className}__think__status--pending`}>
        ...
      </div>
    );
  }

  // 思维链
  renderThinking() {
    if (!isAIMessage(this.props.message)) return;
    const { thinking, status } = this.props.message;
    return (
      <t-collapse className={`${className}__think`} expandIconPlacement="right" defaultExpandAll>
        {convertToLightDomNode(
          <t-collapse-panel
            className={`${className}__think__content`}
            header={
              <>
                {this.renderThinkingStatus()}
                {status === 'stop' ? '思考终止' : thinking?.title}
              </>
            }
            content={thinking?.content || ''}
          />,
        )}
      </t-collapse>
    );
  }

  render(props: TdChatItemProps) {
    const { message, variant, placement, name } = props;
    const { role, status } = message;
    console.log('===item render', this.messageId, status);

    const baseClass = `${className}__inner`;
    const variantClass = variant ? `${className}--variant--${variant}` : '';
    const placementClass = placement;

    return (
      <div className={classname(baseClass, variantClass, placementClass)}>
        {this.renderAvatar()}
        {this.renderMessageStatus}
        {!this.renderMessageStatus ? (
          <div class={`${className}__main`}>
            <div class={`${className}__header`}>
              {name && <span class={`${className}__name`}>{name}</span>}
              {/* {timestamp && <span class={`${className}__time`}>{timestamp}</span>} */}
            </div>
            <div class={classname(`${className}__content`, `${className}__content--base`)}>
              {role === 'assistant' && (
                <>
                  {message?.thinking?.content && this.renderThinking()}
                  {message?.search?.content && <div className={`${className}__search`}>{message.search.content}</div>}
                  {message?.main?.content && (
                    <t-chat-content
                      className={`${className}__detail`}
                      content={message?.main?.content}
                      role={role}
                    ></t-chat-content>
                  )}
                </>
              )}
              {role === 'user' && message?.content && (
                <t-chat-content
                  className={`${className}__detail`}
                  content={message.content}
                  role={role}
                ></t-chat-content>
              )}
            </div>
            <div className={`${className}__actions`}>{this.renderActions()}</div>
          </div>
        ) : null}
      </div>
    );
  }

  private handleAction = (action: string, index: number) => {
    this.fire('action', { action, index });
  };
}
