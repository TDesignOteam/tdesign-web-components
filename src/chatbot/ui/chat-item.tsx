import './chat-markdown-content';
import './auto-scroll';
import '../../collapse';
import '../../skeleton';
import '../../attachments';
import '../../image';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';
import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';
import 'tdesign-icons-web-components/esm/components/thumb-up-filled';
import 'tdesign-icons-web-components/esm/components/thumb-down-filled';
import 'tdesign-icons-web-components/esm/components/thumb-up';
import 'tdesign-icons-web-components/esm/components/thumb-down';
import 'tdesign-icons-web-components/esm/components/share-1';
import 'tdesign-icons-web-components/esm/components/arrow-right';

import { isString } from 'lodash-es';
import { Component, OmiProps, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import { MessagePlugin } from '../../message';
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
  MessageStatus,
  SearchContent,
  SuggestionContent,
  ThinkingContent,
  UserMessageContent,
} from '../core/type';
import type { TdChatItemAction, TdChatItemActionName, TdChatItemProps } from '../type';
import { markdownToTextWithParser } from './md/utils';

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
  pIsGood = signal(false);

  pIsBad = signal(false);

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

  ready() {
    const { message } = this.props;
    if (message && isAIMessage(message)) {
      this.pIsGood.value = message.isGood;
      this.pIsBad.value = message.isBad;
    }
  }

  private renderAvatar() {
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
      if (!isTextContent(item) && !isMarkdownContent(item)) {
        return pre;
      }
      // markdown文本去除语法符号
      if (isMarkdownContent(item)) {
        return pre + markdownToTextWithParser(item.data);
      }
      return pre + item.data;
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
        this.pIsGood.value = !this.pIsGood.value;
        this.handleClickAction('good', this.props.message);
      },
    };
    if (type === 'good') {
      if (isActive) {
        config.icon = <t-icon-thumb-up-filled />;
        config.clickCallback = () => {
          this.pIsGood.value = !this.pIsGood.value;
          this.handleClickAction('goodActived', this.props.message);
        };
      }
    } else {
      config.label = '点踩';
      if (isActive) {
        config.icon = <t-icon-thumb-down-filled />;
        config.clickCallback = () => {
          this.pIsBad.value = !this.pIsBad.value;
          this.handleClickAction('badActived', this.props.message);
        };
      } else {
        config.icon = <t-icon-thumb-down />;
        config.clickCallback = () => {
          this.pIsBad.value = !this.pIsBad.value;
          this.handleClickAction('bad', this.props.message);
        };
      }
    }
    return (
      <t-tooltip content={config.label}>
        <div class={`${className}__actions__preset__wrapper`} onClick={config.clickCallback}>
          {config.icon}
        </div>
      </t-tooltip>
    );
  };

  private presetActions: TdChatItemAction[] = [
    {
      name: 'replay',
      render: (
        <t-tooltip content="重新生成">
          <div class={`${className}__actions__preset__wrapper`} onClick={this.clickRefreshHandler}>
            <t-icon-refresh />
          </div>
        </t-tooltip>
      ),
      // 条件：最后一条AI消息才可以重新生成
      condition: (message) => {
        const lastAIMessage = this.injection.chatEngine?.messageStore?.lastAIMessage;
        return message.id === lastAIMessage?.id;
      },
    },
    {
      name: 'copy',
      render: (
        <t-tooltip content="复制">
          <div class={`${className}__actions__preset__wrapper`} onClick={this.clickCopyHandler}>
            <t-icon-copy />
          </div>
        </t-tooltip>
      ),
    },
    {
      name: 'goodActived',
      condition: () => this.pIsGood.value,
      render: this.renderComment('good', true),
    },
    {
      name: 'good',
      condition: () => !this.pIsGood.value,
      render: this.renderComment('good', false),
    },
    {
      name: 'badActived',
      condition: () => this.pIsBad.value,
      render: this.renderComment('bad', true),
    },
    {
      name: 'bad',
      condition: () => !this.pIsBad.value,
      render: this.renderComment('bad', false),
    },
    {
      name: 'share',
      render: (
        <t-tooltip content="分享">
          <div
            class={`${className}__actions__preset__wrapper`}
            onClick={() => this.handleClickAction('share', this.props.message)}
          >
            <t-icon-share-1 />
          </div>
        </t-tooltip>
      ),
    },
  ];

  private renderActions() {
    const { actions, message } = this.props;
    if (!actions) {
      return null;
    }
    let arrayActions: TdChatItemAction[] = Array.isArray(actions) ? actions : this.presetActions;
    if (typeof actions === 'function') {
      arrayActions = actions(this.presetActions, message);
    }

    return arrayActions.map((item) => {
      // 默认消息完成时才展示action
      if (message.status !== 'complete') {
        return null;
      }
      if (item.condition && !item.condition(message)) {
        return null;
      }
      return (
        <span key={item.name} class={`${className}__actions__item__wrapper`}>
          {item.render}
        </span>
      );
    });
  }

  get renderMessageStatus() {
    if (!isAIMessage(this.props.message)) return;
    const { status, content = [] } = this.props.message;
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
          <t-auto-scroll maxHeight={this.props?.chatContentProps?.thinking?.height}>
            <div className={`${className}__think__inner`}>
              {/* 上下阴影 */}
              {this.props?.chatContentProps?.thinking?.height ? (
                <div className={`${className}__think__shadow__top`}></div>
              ) : null}
              {data?.text || ''}
              {this.props?.chatContentProps?.thinking?.height ? (
                <div className={`${className}__think__shadow__bottom`}></div>
              ) : null}
            </div>
          </t-auto-scroll>
          <div slot="header" className={`${className}__think__header__content`}>
            {(status === 'streaming' || status === 'complete') && this.renderThinkingStatus(status)}
            {status === 'stop' ? '思考已终止' : data?.title}
          </div>
        </t-collapse-panel>
      </t-collapse>
    );
  }

  private renderSearch(content: SearchContent) {
    const { chatContentProps } = this.props;
    const { references, title } = content.data;
    const titleText = content?.status === 'stop' ? '搜索已终止' : title;
    const imgs = (
      <div className={`${className}__search-icons`}>
        {references.map((item) =>
          item?.icon ? <img className={`${className}__search-icon`} alt={item.title} src={item.icon} /> : null,
        )}
      </div>
    );
    const header = (
      <div className={`${className}__search__header`}>
        {imgs}
        {titleText}
      </div>
    );
    return (
      <div
        className={`${className}__search__wrapper`}
        onClick={() => {
          if (chatContentProps?.search?.expandable) {
            this.searchExpand.value = !this.searchExpand.value;
          }
          this.handleClickAction('searchResult', content);
        }}
      >
        {this.searchExpand.value ? (
          <t-collapse
            className={`${className}__search`}
            expandIconPlacement="right"
            value={[1]}
            onChange={() => {
              this.searchExpand.value = !this.searchExpand.value;
            }}
          >
            <t-collapse-panel className={`${className}__search__content`}>
              <div
                className={`${className}__search-links`}
                onClick={() => {
                  this.handleClickAction('searchItem', content);
                }}
              >
                {references.map((content, idx) => (
                  <a target="_blank" href={content.url} className={`${className}__search-link`}>
                    {idx + 1}. {content.title}
                  </a>
                ))}
              </div>
              <div slot="header" className={`${className}__search__header__content`}>
                {titleText}
              </div>
            </t-collapse-panel>
          </t-collapse>
        ) : (
          header
        )}
      </div>
    );
  }

  private renderSuggestion(content: SuggestionContent) {
    const { data } = content;
    return (
      <div className={`${className}__suggestion`}>
        {data.map((suggestion, idx) =>
          suggestion?.title ? (
            <div
              key={idx}
              className={`${className}__suggestion-item`}
              onClick={() => {
                this.handleClickAction('suggestion', suggestion, () => {
                  this.injection.chatEngine.sendMessage({
                    prompt: suggestion.prompt,
                  });
                });
              }}
            >
              {suggestion.title}
              {convertToLightDomNode(<t-icon-arrow-right class={`${className}__suggestion-arrow`} />)}
            </div>
          ) : null,
        )}
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
    const { role } = message;
    return message.content.map((content, index) => {
      const elementKey = `${message.id}-${index}`;
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
          return (
            <slot key={elementKey} name={`${message.id}-${config?.slotName || `${content.type}-${index}`}`}></slot>
          );
        }
        if (isSearchContent(content)) {
          return this.renderSearch(content);
        }
        if (isSuggestionContent(content)) {
          return this.renderSuggestion(content);
        }
        if (isThinkingContent(content)) {
          // 思考
          return this.renderThinking(content);
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
    const { message, variant, placement, name, datetime } = props;
    if (!message?.content || message.content.length === 0) return;
    console.log('==========item render', message.id);

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
            <div className={`${className}__actions`}>{this.renderActions()}</div>
          </div>
        ) : null}
      </div>
    );
  }
}
