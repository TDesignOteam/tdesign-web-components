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
import type { TdChatItemAction, TdChatItemProps } from '../type';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

const presetActions: TdChatItemAction[] = [
  { name: 'refresh', render: <t-icon-refresh />, status: ['complete'] },
  { name: 'copy', render: <t-icon-copy /> },
];
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

  install() {
    this.messageId = this.props.id!;
  }

  receiveProps(
    props: TdChatItemProps | OmiProps<TdChatItemProps, any>,
    oldProps: TdChatItemProps | OmiProps<TdChatItemProps, any>,
  ) {
    if (props?.main?.content === oldProps?.main?.content && props?.thinking?.content === oldProps?.thinking?.content) {
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

  renderActions() {
    const { actions, status } = this.props;
    if (!actions) {
      return null;
    }
    let arrayActions: TdChatItemAction[] = Array.isArray(actions) ? actions : presetActions;
    if (typeof actions === 'function') {
      arrayActions = actions(presetActions);
    }

    return arrayActions.map((item, idx) => {
      // 默认消息完成时才展示action
      if (!item.status && status !== 'complete') {
        return null;
      }
      if (item.status && !item.status.includes(status)) {
        return null;
      }
      return (
        <span class={`${className}__actions__item__wrapper`} onClick={() => this.handleAction(item.name, idx)}>
          {item.render}
        </span>
      );
    });
  }

  get renderMessageStatus() {
    const { status, thinking, search, main } = this.props;
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
    const { thinking, status } = this.props;

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
    return <div class={`${className}__think__status--pending`} part={`${className}__think__status--pending`} />;
  }

  // 思维链
  renderThinking() {
    const { thinking, status } = this.props;
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
    const { role, variant, placement, name, datetime, status } = props;
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
              {datetime && <span class={`${className}__time`}>{datetime}</span>}
            </div>
            <div class={classname(`${className}__content`, `${className}__content--base`)}>
              {this.props?.thinking?.content && this.renderThinking()}
              {this.props?.search?.content && <div className={`${className}__search`}>{this.props.search.content}</div>}
              {this.props?.main?.content && (
                <t-chat-content
                  className={`${className}__detail`}
                  content={this.props.main.content}
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
