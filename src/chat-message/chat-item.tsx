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
import { setExportparts } from '../_util/dom';
import { convertToLightDomNode } from '../_util/lightDom';
import { DefaultChatMessageActionsName } from '../chat-action/action';
import {
  isAttachmentContent,
  isImageContent,
  isMarkdownContent,
  isSearchContent,
  isSuggestionContent,
  isTextContent,
  isThinkingContent,
  isUserMessage,
} from '../chatbot';
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

  // 声明哪些prop是slot
  static slotProps = ['avatar', 'name'];

  static propTypes = {
    actions: [Array, Function, Boolean],
    name: [String, Object], // 支持传入String或ReactNode
    avatar: [String, Object], // 支持传入String或ReactNode
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

    return true;
  }

  ready(): void {
    setExportparts(this);
  }

  private renderMessageHeader() {
    const { name, datetime } = this.props;
    if (!name && !datetime) {
      return null;
    }
    return (
      <div class={`${className}__header`}>
        {!!name && <span class={`${className}__name`}>{this.renderNameContent(name)}</span>}
        {!!datetime && <span class={`${className}__time`}>{datetime}</span>}
      </div>
    );
  }

  private renderNameContent(name: any) {
    if (isString(name)) {
      return name;
    }

    // 对于非字符串类型（包括React元素），都使用slot
    return <slot name="name"></slot>;
  }

  private renderAvatar() {
    if (!this.props.avatar) {
      return <div hidden data-test={`${typeof this.props.avatar}`} />;
    }

    const { avatar } = this.props;

    return (
      <div class={`${className}__avatar`}>
        <div class={`${className}__avatar__box`}>{this.renderAvatarContent(avatar)}</div>
      </div>
    );
  }

  private renderAvatarContent(avatar: any) {
    if (isString(avatar)) {
      return <img src={avatar} alt="avatar" class={`${className}__avatar-image`} />;
    }

    // 对于非字符串类型（包括React元素），都使用slot
    return <slot name="avatar"></slot>;
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
    const { status } = this.props.message;
    const { animation = 'skeleton' } = this.props;
    if (status === 'pending') {
      return (
        <div class={`${className}-chat-loading`}>
          {convertToLightDomNode(
            <t-chat-loading className={`${className}-chat-loading-light`} animation={animation}></t-chat-loading>,
          )}
        </div>
      );
    }
    if (status === 'stop') {
      return <div className={`${className}__stop`}>已终止</div>;
    }
    if (status === 'error') {
      return <div className={`${className}__error`}>请求失败</div>;
    }
    return null;
  }

  renderMessage() {
    const { message, chatContentProps, animation } = this.props;
    const { role, id } = message;
    return message.content.map((content, index) => {
      const elementKey = `${id}-${index}`;
      // 系统消息渲染
      if (role === 'system') {
        return (
          <div key={elementKey} className={`${getClassPrefix()}-chat__text--${role}`}>
            {content.data}
          </div>
        );
      }
      // 用户消息渲染
      if (role === 'user') {
        if (isAttachmentContent(content)) {
          return renderAttachments({ key: elementKey, content: content.data }, this);
        }
        if (isTextContent(content) || isMarkdownContent(content)) {
          return (
            <div key={elementKey} className={`${getClassPrefix()}-chat__text--${role}`}>
              {content.data}
            </div>
          );
        }
        return <slot key={elementKey} name={`${content?.slotName || `${content.type}-${index}`}`}></slot>;
      }

      // AI消息渲染
      if (role === 'assistant') {
        if (isSearchContent(content)) {
          return renderSearch({
            key: elementKey,
            content: content.data,
            status: content.status,
            useCollapse: chatContentProps?.search?.useCollapse,
            handleSearchItemClick: (data) => this.handleClickAction('searchItem', data),
            handleSearchResultClick: (data) => this.handleClickAction('searchResult', data),
            ...content?.ext,
          });
        }

        if (isSuggestionContent(content)) {
          return renderSuggestion({
            key: elementKey,
            content: content.data,
            handlePromptClick: (data) => this.handleClickAction('suggestion', data),
          });
        }
        if (isThinkingContent(content)) {
          // 思考
          return renderThinking({
            key: elementKey,
            content: content.data,
            status: content.status,
            animation,
            ...chatContentProps?.thinking,
            ...content?.ext,
          });
        }
        if (isImageContent(content)) {
          // 图片
          const { url, name } = content.data;
          return (
            <div key={elementKey} className={`${className}__image`}>
              <img src={url} alt={name} width={200} height={200}></img>
            </div>
          );
        }
        if (isTextContent(content) || isMarkdownContent(content)) {
          // 正文回答
          return (
            <t-chat-md-content
              key={elementKey}
              className={`${className}__detail`}
              {...chatContentProps?.markdown}
              content={content.data}
            ></t-chat-md-content>
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
        <div class={`${className}__main`}>
          {this.renderMessageHeader()}
          <slot name="content">
            {this.renderMessageStatus ? (
              this.renderMessageStatus
            ) : (
              <div class={classname(`${className}__content`, `${className}__content--base`)}>
                {this.renderMessage()}
              </div>
            )}
          </slot>
          <slot name="actionbar"></slot>
        </div>
      </div>
    );
  }
}
