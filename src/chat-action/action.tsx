import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';
import 'tdesign-icons-web-components/esm/components/thumb-up-filled';
import 'tdesign-icons-web-components/esm/components/thumb-down-filled';
import 'tdesign-icons-web-components/esm/components/thumb-up';
import 'tdesign-icons-web-components/esm/components/thumb-down';
import 'tdesign-icons-web-components/esm/components/share-1';

import { Component, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { type ChatComment } from '../chatbot';
import { MessagePlugin } from '../message';
import { TdChatActionItem, TdChatActionProps, TdChatActionsName } from './type';

import styles from './style/action.less';

const className = `${getClassPrefix()}-chat-actions`;

export const DefaultChatMessageActionsName = ['replay', 'copy', 'good', 'bad', 'share'] as TdChatActionsName[];
export const renderActions = (
  { actionBar, handleAction, copyText }: TdChatActionProps,
  pComment: Omi.SignalValue<ChatComment>,
) => {
  if (!actionBar) {
    return null;
  }
  const clickCopyHandler = () => {
    const text = copyText.toString();
    if (!text) return;
    navigator.clipboard
      .writeText(copyText.toString())
      .then(() => {
        MessagePlugin.success('复制成功');
      })
      .catch(() => {
        MessagePlugin.success('复制失败，请手动复制');
      });
  };

  const handleClickAction = (action: TdChatActionsName, data: any) => {
    if (action === 'copy') {
      clickCopyHandler();
    }
    handleAction?.(action, data);
  };

  const renderComment = (type: 'good' | 'bad', isActive: boolean) => {
    const config = {
      label: '点赞',
      icon: <t-icon-thumb-up />,
      clickCallback: (e) => {
        pComment.value = 'good';
        handleAction('good', {
          event: e,
          active: true,
        });
      },
    };
    if (type === 'good') {
      if (isActive) {
        config.icon = <t-icon-thumb-up-filled />;
        config.clickCallback = (e) => {
          pComment.value = undefined;
          handleAction('good', {
            event: e,
            active: false,
          });
        };
      }
    } else {
      config.label = '点踩';
      if (isActive) {
        config.icon = <t-icon-thumb-down-filled />;
        config.clickCallback = (e) => {
          pComment.value = undefined;
          handleAction('bad', {
            event: e,
            active: false,
          });
        };
      } else {
        config.icon = <t-icon-thumb-down />;
        config.clickCallback = (e) => {
          pComment.value = 'bad';
          handleAction('bad', {
            event: e,
            active: true,
          });
        };
      }
    }
    return (
      <span class={`${className}__item__wrapper`} onClick={config.clickCallback}>
        {config.icon}
      </span>
    );
  };

  const defaultPresetActions = (name, icon) => (
    <span
      class={`${className}__item__wrapper`}
      onClick={(e) =>
        handleClickAction(name, {
          event: e,
        })
      }
    >
      {icon}
    </span>
  );

  const presetActions = () =>
    [
      { name: 'replay', render: defaultPresetActions('replay', <t-icon-refresh />) },
      { name: 'copy', render: defaultPresetActions('copy', <t-icon-copy />) },
      {
        name: 'good',
        render: renderComment('good', pComment.value === 'good'),
      },
      {
        name: 'bad',
        render: renderComment('bad', pComment.value === 'bad'),
      },
      { name: 'share', render: defaultPresetActions('share', <t-icon-share-1 />) },
    ] as TdChatActionItem[];

  const arrayActions: TdChatActionItem[] =
    Array.isArray(actionBar) && actionBar.length > 0
      ? actionBar.map((action) => presetActions().find((item) => item.name === action))
      : presetActions();

  return <div className={className}>{arrayActions.map((item) => item.render)}</div>;
};

// Web Component版本
@tag('t-chat-action')
export default class ChatAction extends Component<TdChatActionProps> {
  static css = [styles];

  static propTypes = {
    actionBar: Object,
    handleAction: Object,
    comment: String,
    copyText: String,
  };

  static defaultProps: Partial<TdChatActionProps> = {
    actionBar: true,
    copyText: '',
    comment: '',
  };

  private pComment = signal<ChatComment>(this.props.comment);

  installed(): void {
    this.pComment.value = this.props.comment;
  }

  render(props: TdChatActionProps) {
    return renderActions(props, this.pComment);
  }
}
