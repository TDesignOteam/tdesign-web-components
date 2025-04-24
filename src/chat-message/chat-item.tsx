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
import {
  AttachmentItem,
  isAIMessage,
  isImageContent,
  isMarkdownContent,
  isSearchContent,
  isSuggestionContent,
  isTextContent,
  isThinkingContent,
  isUserMessage,
  UserMessageContent,
} from '../chatbot/core/type';
import type { ChatComment, TdChatItemAction, TdChatItemActionName, TdChatItemProps } from '../chatbot/type';
import { MessagePlugin } from '../message';
import { renderSearch } from './content/search-content';
import { renderSuggestion } from './content/suggestion-content';
import { renderThinking } from './content/thinking-content';

import styles from './style/chat-item.less';

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
    customRenderConfig: Object,
    onActions: Function,
  };

  static defaultProps = {
    variant: 'text',
    placement: 'left',
  };

  inject = ['chatEngine'];

  searchExpand = signal(false);

  /** 点赞点踩目前做成非受控，点了就生效 */
  pComment = signal<ChatComment>(undefined);

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
      JSON.stringify(newMsg.content).length === JSON.stringify(oldMsg.content).length
    ) {
      return false;
    }

    return true;
  }

  ready() {
    const { message } = this.props;
    if (message && isAIMessage(message)) {
      this.pComment.value = message.comment;
    }
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

  private handleClickAction = (action: TdChatItemActionName, data?: any, callback?: Function) => {
    if (this.props?.onActions?.[action]) {
      this.props.onActions[action](data, callback);
    } else {
      callback?.();
      this.fire(
        'message_action',
        { action, data },
        {
          composed: true,
        },
      );
    }
  };

  private clickRefreshHandler = () => {
    if (!isAIMessage(this.props.message)) {
      return;
    }
    this.handleClickAction('replay', this.props.message, () => this.injection.chatEngine.regenerateAIMessage());
  };

  private clickCopyHandler = () => {
    if (!isAIMessage(this.props.message)) {
      return;
    }
    const copyContent = this.props.message.content.reduce((pre, item) => {
      let append = '';
      if (isTextContent(item) || isMarkdownContent(item)) {
        append = item.data;
      } else if (isThinkingContent(item)) {
        append = item.data.text;
      }
      if (!pre) {
        return append;
      }
      return `${pre}\n${append}`;
    }, '');
    this.handleClickAction('copy', copyContent.toString(), () => {
      navigator.clipboard
        .writeText(copyContent.toString())
        .then(() => {
          MessagePlugin.success('复制成功');
        })
        .catch(() => {
          MessagePlugin.success('复制失败，请手动复制');
        });
    });
  };

  private renderComment = (type: 'good' | 'bad', isActive: boolean) => {
    const config = {
      label: '点赞',
      icon: <t-icon-thumb-up />,
      clickCallback: () => {
        this.pComment.value = 'good';
        this.handleClickAction('good', {
          message: this.props.message,
          active: true,
        });
      },
    };
    if (type === 'good') {
      if (isActive) {
        config.icon = <t-icon-thumb-up-filled />;
        config.clickCallback = () => {
          this.pComment.value = undefined;
          this.handleClickAction('good', {
            message: this.props.message,
            active: false,
          });
        };
      }
    } else {
      config.label = '点踩';
      if (isActive) {
        config.icon = <t-icon-thumb-down-filled />;
        config.clickCallback = () => {
          this.pComment.value = undefined;
          this.handleClickAction('bad', {
            message: this.props.message,
            active: false,
          });
        };
      } else {
        config.icon = <t-icon-thumb-down />;
        config.clickCallback = () => {
          this.pComment.value = 'bad';
          this.handleClickAction('bad', {
            message: this.props.message,
            active: true,
          });
        };
      }
    }
    return (
      <div class={`${className}__actions__preset__wrapper`} onClick={config.clickCallback}>
        {config.icon}
      </div>
    );
  };

  get presetActions(): TdChatItemAction[] {
    return [
      {
        name: 'replay',
        render: (
          <div class={`${className}__actions__preset__wrapper`} onClick={this.clickRefreshHandler}>
            <t-icon-refresh />
          </div>
        ),
      },
      {
        name: 'copy',
        render: (
          <div class={`${className}__actions__preset__wrapper`} onClick={this.clickCopyHandler}>
            <t-icon-copy />
          </div>
        ),
      },
      {
        name: 'good',
        render: this.renderComment('good', this.pComment.value === 'good'),
      },
      {
        name: 'bad',
        render: this.renderComment('bad', this.pComment.value === 'bad'),
      },
      {
        name: 'share',
        render: (
          <div
            class={`${className}__actions__preset__wrapper`}
            onClick={() => this.handleClickAction('share', this.props.message)}
          >
            <t-icon-share-1 />
          </div>
        ),
      },
    ];
  }

  get renderMessageStatus() {
    if (!isAIMessage(this.props.message)) return null;
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
      return <div className={`${className}__detail`}>出错了</div>;
    }
    return (
      <div class={`${className}-chat-loading`}>
        {convertToLightDomNode(<t-chat-loading animation={animation}></t-chat-loading>)}
      </div>
    );
  }

  private renderAttachments() {
    if (!isUserMessage(this.props.message)) return null;
    const findAttachment = (this.props.message.content as UserMessageContent[]).find(
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
                {convertToLightDomNode(
                  <t-image
                    src={url}
                    alt={name}
                    className={`${className}__preview-image`}
                    shape="round"
                    loading="lazy"
                  />,
                )}
              </div>
            ))}
          </div>
        ) : (
          convertToLightDomNode(<t-attachments items={attachments} />)
        )}
      </div>
    );
  }

  renderMessage() {
    const { message, chatContentProps, customRenderConfig } = this.props;
    const { role, id } = message;
    return message.content.map((content, index) => {
      const elementKey = `${id}-${index}`;
      const renderer = customRenderConfig?.[content?.type];
      // 用户和系统消息渲染
      if (role === 'user' || role === 'system') {
        if (!isTextContent(content) && !isMarkdownContent(content)) {
          return null;
        }
        return convertToLightDomNode(
          <t-chat-md-content
            key={elementKey}
            className={`${className}__detail`}
            {...chatContentProps?.markdown}
            content={content?.data || content}
            role={role}
          ></t-chat-md-content>,
        );
      }

      // AI消息渲染
      if (role === 'assistant') {
        // 自定义渲染
        if (renderer) {
          const config = renderer(content);
          return <slot key={elementKey} name={`${config?.slotName || `${content.type}-${index}`}`}></slot>;
        }
        if (isSearchContent(content)) {
          return renderSearch({
            content: content.data,
            status: content.status,
            expandable: chatContentProps?.search?.expandable,
            handleSearchItemClick: (data) => this.handleClickAction('searchItem', data),
            handleSearchResultClick: (data) => this.handleClickAction('searchResult', data),
          });
        }

        if (isSuggestionContent(content)) {
          return renderSuggestion({
            content: content.data,
            handlePromptClick: (data) =>
              this.handleClickAction('suggestion', data, () => {
                this.injection.chatEngine.sendUserMessage({
                  prompt: data.content,
                });
              }),
          });
        }
        if (isThinkingContent(content)) {
          // 思考
          return renderThinking({
            content: content.data,
            status: content.status,
            maxHeight: this.props.chatContentProps?.thinking?.maxHeight,
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
              role={role}
            ></t-chat-md-content>,
          );
        }
        return null;
      }

      return null;
    });
  }

  render(props: TdChatItemProps) {
    const { message, variant, placement, name, datetime, onActions } = props;
    if (!message?.content || message.content.length === 0) return;

    const baseClass = `${className}__inner`;
    const roleClass = `${className}__role--${message.role}`;
    const variantClass = variant ? `${className}--variant--${variant}` : '';
    const placementClass = placement;

    return (
      <div className={classname(baseClass, roleClass, variantClass, placementClass)}>
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
            <slot name="actions">
              {message.status !== 'complete' && message.status !== 'stop' ? null : (
                <t-chat-action onActions={onActions} actionBar={this.presetActions}></t-chat-action>
              )}
            </slot>
          </div>
        ) : null}
      </div>
    );
  }
}
