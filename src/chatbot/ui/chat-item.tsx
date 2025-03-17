import './chat-content';
import '../../collapse';
import '../../skeleton';
import '../../attachments';
import '../../image';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';
import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';

import { isString } from 'lodash-es';
import { Component, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import { MessagePlugin } from '../../message';
import {
  AttachmentItem,
  isAIMessage,
  isImageContent,
  isMarkdownContent,
  isTextContent,
  isThinkingContent,
  isUserMessage,
  MessageStatus,
  ThinkingContent,
} from '../core/type';
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
    message: Object,
    placement: String,
    role: String,
    variant: String,
    chatContentProps: Object,
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
    const copyContent = this.props.message.content.reduce((pre, item) => {
      if (!isTextContent(item) && !isMarkdownContent(item)) {
        return pre;
      }
      return pre + item.data;
    }, '');

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
      JSON.stringify(newMsg.content) === JSON.stringify(oldMsg.content)
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
    const { status, content = [] } = this.props.message;
    // 如果有任一内容，就不用展示message整体状态
    if (content.length > 0) {
      return null;
    }
    if (status === 'stop') {
      return <div className={`${className}__detail`}>已终止</div>;
    }
    if (status === 'error') {
      return <div className={`${className}__detail`}>出错了</div>;
    }
    return (
      <t-skeleton class={`${className}__skeleton`} loading={true} theme="paragraph" animation="gradient"></t-skeleton>
    );
  }

  // 思维链
  private renderThinkingStatus(status: MessageStatus) {
    if (status === 'complete' || status === 'stop')
      return convertToLightDomNode(<t-icon-check-circle class={`${className}__think__status--complete`} />);
    if (status === 'error')
      return convertToLightDomNode(<t-icon-close-circle class={`${className}__think__status--error`} />);
    return <div class={`${className}__think__status--pending`}>...</div>;
  }

  private renderThinking(content: ThinkingContent) {
    const { data, status } = content;
    return (
      <t-collapse className={`${className}__think`} expandIconPlacement="right" value={[1]}>
        <t-collapse-panel className={`${className}__think__content`}>
          {data?.text || ''}
          <div slot="header" className={`${className}__think__header__content`}>
            {this.renderThinkingStatus(status)}
            {status === 'stop' ? '思考终止' : data?.title}
          </div>
        </t-collapse-panel>
      </t-collapse>
    );
  }

  private renderAttachments() {
    if (!isUserMessage(this.props.message)) return null;
    const findAttachment = this.props.message.content.find(
      ({ type, data = [] }) => type === 'attachment' && data.length,
    );
    if (!findAttachment) return;
    const attachments = findAttachment.data as AttachmentItem[];
    // 判断是否全部是图片类型
    const isAllImages = attachments.every((att) => /image/.test(att.fileType));
    return (
      <div className={`${className}__attachments`}>
        {isAllImages ? (
          <div className={`${className}__image-grid`}>
            {attachments.map(({ url, name }, index) => (
              <div className={`${className}__image-wrapper`} key={index}>
                <t-image src={url} alt={name} className={`${className}__preview-image`} shape="round" loading="lazy" />
              </div>
            ))}
          </div>
        ) : (
          <t-attachments items={attachments} />
        )}
      </div>
    );
  }

  renderMessage() {
    const { message, chatContentProps } = this.props;
    const { role } = message;
    return message.content.map((content, index) => {
      const elementKey = `${message.id}-${index}`;
      // 用户和系统消息渲染
      if (role === 'user' || role === 'system') {
        if (!message?.content) return null;
        return (
          <t-chat-content
            key={elementKey}
            className={`${className}__detail`}
            {...chatContentProps}
            content={content?.data || content}
            role={role}
          ></t-chat-content>
        );
      }

      // AI消息渲染
      if (role === 'assistant') {
        if (isThinkingContent(content)) {
          // 思考
          return this.renderThinking(content);
        }
        if (isTextContent(content) || isMarkdownContent(content)) {
          // 正文回答
          return (
            <t-chat-content
              className={`${className}__detail`}
              {...chatContentProps}
              content={content.data}
              role={role}
            ></t-chat-content>
          );
        }
        if (isImageContent(content)) {
          // 图片
          const { url, name } = content.data;
          return (
            <div>
              <img src={url} alt={name} width={200} height={200}></img>
            </div>
          );
        }
        return (
          // todo: 自定义消息Render
          <div>
            自定义消息：{content.type}，{JSON.stringify(content.data)}
          </div>
        );
      }

      return null;
    });
  }

  render(props: TdChatItemProps) {
    const { message, variant, placement, name, datetime } = props;
    if (!message?.content) return;
    console.log('===item render', this.messageId);

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
            <div class={classname(`${className}__content`, `${className}__content--base`)}>{this.renderMessage()}</div>
            {this.renderAttachments()}
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
