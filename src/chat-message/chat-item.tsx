import './content/markdown-content';
import '../collapse';
import '../chat-loading';
import '../attachments';
import '../chat-action';
import '../image';
import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';
import 'tdesign-icons-web-components/esm/components/thumb-up-filled';
import 'tdesign-icons-web-components/esm/components/thumb-down-filled';
import 'tdesign-icons-web-components/esm/components/thumb-up';
import 'tdesign-icons-web-components/esm/components/thumb-down';
import 'tdesign-icons-web-components/esm/components/share-1';

import { isString } from 'lodash-es';
import { Component, OmiProps, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { DefaultChatMessageActionsName } from '../chat-action/action';
import {
  isAIMessage,
  isImageContent,
  isMarkdownContent,
  isSearchContent,
  isSuggestionContent,
  isTextContent,
  isThinkingContent,
  isUserMessage,
} from '../chatbot';
import { AttachmentItem, UserMessageContent } from '../chatbot/core/type';
import type { TdChatMessageActionName, TdChatMessageProps } from '../chatbot/type';
import { renderAttachments } from './content/attachment-content';
import { renderSearch } from './content/search-content';
import { renderSuggestion } from './content/suggestion-content';
import { renderThinking } from './content/thinking-content';

import styles from './style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

type ChatMessageProps = TdChatMessageProps;
@tag('t-chat-item')
export default class ChatItem extends Component<ChatMessageProps> {
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
    handleActions: Object,
    animation: String,
  };

  static defaultProps = {
    actions: DefaultChatMessageActionsName,
    variant: 'text',
    placement: 'left',
  };

  searchExpand = signal(false);

  receiveProps(
    props: ChatMessageProps | OmiProps<ChatMessageProps, any>,
    oldProps: ChatMessageProps | OmiProps<ChatMessageProps, any>,
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
      JSON.stringify(newMsg.content).length === JSON.stringify(oldMsg.content).length
    ) {
      return false;
    }

    return true;
  }

  private renderMessageHeader() {
    const { name, datetime } = this.props;
    if (this.renderMessageStatus || (!name && !datetime)) {
      return null;
    }
    return (
      <div class={`${className}__header`}>
        {!!name && <span class={`${className}__name`}>{name}</span>}
        {!!datetime && <span class={`${className}__time`}>{datetime}</span>}
      </div>
    );
  }

  private renderAvatar() {
    if (!this.props.avatar) {
      // 不要返回null，有抖动问题
      return <div hidden />;
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

  private handleClickAction = (action: Partial<TdChatMessageActionName>, data?: any) => {
    const toData = {
      ...data,
      message: this.props.message,
    };
    if (this.props?.handleActions?.[action]) {
      this.props.handleActions[action](toData);
    }
    this.fire(
      'chat_message_action',
      { action, data: toData },
      {
        composed: true,
      },
    );
  };

  get renderMessageStatus() {
    // console.log('=====renderMessageStatus', isAIMessage(this.props.message));
    // if (!isAIMessage(this.props.message)) return null;
    const { status, content = [] } = this.props.message;
    const { animation = 'skeleton' } = this.props;
    // 如果有任一内容，就不用展示message整体状态
    if (content.length > 0 || status === 'complete') {
      return null;
    }
    if (status === 'stop') {
      return <div className={`${className}__detail`}>已终止</div>;
    }
    if (status === 'error') {
      return <div className={`${className}__error`}>请求失败</div>;
    }
    return (
      <div class={`${className}-chat-loading`}>
        {convertToLightDomNode(
          <t-chat-loading className={`${className}-chat-loading-light`} animation={animation}></t-chat-loading>,
        )}
      </div>
    );
  }

  private renderAttachmentPart() {
    if (!isUserMessage(this.props.message)) return <div hidden />;
    const findAttachment = (this.props.message.content as UserMessageContent[]).find(
      ({ type, data = [] }) => type === 'attachment' && data.length,
    );
    if (!findAttachment) return;
    const attachments = findAttachment.data as AttachmentItem[];
    return renderAttachments({ content: attachments }, this);
  }

  renderMessage() {
    const { message, chatContentProps, animation } = this.props;
    const { role, id } = message;
    return message.content.map((content, index) => {
      const elementKey = `${id}-${index}`;
      // 用户和系统消息渲染
      if (!isAIMessage(message)) {
        if (!isTextContent(content) && !isMarkdownContent(content)) {
          return null;
        }
        return <div className={`${getClassPrefix()}-chat__text--${role}`}>{content.data}</div>;
      }

      // AI消息渲染
      if (role === 'assistant') {
        if (isSearchContent(content)) {
          return renderSearch({
            content: content.data,
            status: content.status,
            useCollapse: chatContentProps?.search?.useCollapse,
            handleSearchItemClick: (data) => this.handleClickAction('searchItem', data),
            handleSearchResultClick: (data) => this.handleClickAction('searchResult', data),
          });
        }

        if (isSuggestionContent(content)) {
          return renderSuggestion({
            content: content.data,
            handlePromptClick: (data) => this.handleClickAction('suggestion', data),
          });
        }
        if (isThinkingContent(content)) {
          // 思考
          return renderThinking({
            content: content.data,
            status: content.status,
            animation,
            ...this.props.chatContentProps?.thinking,
          });
        }
        if (isImageContent(content)) {
          // 图片
          const { url, name } = content.data;
          return (
            <div key={elementKey}>
              <img src={url} alt={name} width={200} height={200}></img>
            </div>
          );
        }
        if (isTextContent(content) || isMarkdownContent(content)) {
          // 正文回答
          return convertToLightDomNode(
            <t-chat-md-content
              key={elementKey}
              className={`${className}__detail`}
              {...chatContentProps?.markdown}
              content={content.data}
            ></t-chat-md-content>,
          );
        }
        // 自定义渲染slot
        return <slot key={elementKey} name={`${content?.slotName || `${content.type}-${index}`}`}></slot>;
      }

      return null;
    });
  }

  render(props: ChatMessageProps) {
    const { message, variant, placement } = props;
    if (!message) return;

    const baseClass = `${className}__inner`;
    const roleClass = `${className}__role--${message?.role}`;
    const variantClass = variant ? `${className}--variant--${variant}` : '';
    const placementClass = placement;

    return (
      <div
        className={classname(baseClass, roleClass, variantClass, placementClass)}
        data-has-header={!!this.renderMessageHeader()}
      >
        {this.renderAvatar()}
        {this.renderMessageStatus}
        {!this.renderMessageStatus ? (
          <div class={`${className}__main`}>
            {this.renderMessageHeader()}
            {this.renderAttachmentPart()}
            <div class={classname(`${className}__content`, `${className}__content--base`)}>{this.renderMessage()}</div>
            <slot name="actionbar"></slot>
          </div>
        ) : null}
      </div>
    );
  }
}
