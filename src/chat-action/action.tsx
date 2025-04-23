import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';
import 'tdesign-icons-web-components/esm/components/thumb-up-filled';
import 'tdesign-icons-web-components/esm/components/thumb-down-filled';
import 'tdesign-icons-web-components/esm/components/thumb-up';
import 'tdesign-icons-web-components/esm/components/thumb-down';
import 'tdesign-icons-web-components/esm/components/share-1';

import { Component, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import type { ChatMessageType, TdChatItemAction } from '../chatbot/type';
import type { StyledProps, TNode } from '../common';
import { TdActionProps, TdChatActionsName } from './type';

import styles from './style/action.less';

export interface ActionProps extends TdActionProps, StyledProps {}

const className = `${getClassPrefix()}-chat-action`;

@tag('t-chat-action')
export default class ChatAction extends Component<TdActionProps> {
  static css = [styles];

  actions: { name: TdChatActionsName; icon: TNode; condition?: (message: ChatMessageType) => boolean }[] = [
    { name: 'replay', icon: <t-icon-refresh /> },
    { name: 'copy', icon: <t-icon-copy /> },
    { name: 'good', icon: <t-icon-thumb-up /> },
    { name: 'bad', icon: <t-icon-thumb-down /> },
    { name: 'goodActived', icon: <t-icon-thumb-up-filled /> },
    { name: 'badActived', icon: <t-icon-thumb-down-filled /> },
    { name: 'share', icon: <t-icon-share-1 /> },
  ];

  private handleClickAction = (action: TdChatActionsName, e: MouseEvent) => {
    this.props?.onActions?.[action](e);
  };

  private defaultPresetActions: TdChatItemAction[] = this.actions.map((action) => ({
    name: action.name,
    render: (
      <div class={`${className}__actions__preset__wrapper`} onClick={(e) => this.handleClickAction(action.name, e)}>
        {action.icon}
      </div>
    ),
    condition: action?.condition,
  }));

  render(props: ActionProps) {
    const { actionBar = true } = props;
    if (!actionBar) {
      return null;
    }

    const arrayActions: TdChatItemAction[] =
      Array.isArray(actionBar) && actionBar.length > 0
        ? actionBar.map((action) => this.defaultPresetActions.find((item) => item.name === action))
        : this.defaultPresetActions;

    return (
      <div className={className}>
        {arrayActions.map((item) => (
            <span key={item.name} class={`${className}__item__wrapper`}>
              {item.render}
            </span>
          ))}
      </div>
    );
  }
}
