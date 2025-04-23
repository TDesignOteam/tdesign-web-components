import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';
import 'tdesign-icons-web-components/esm/components/thumb-up-filled';
import 'tdesign-icons-web-components/esm/components/thumb-down-filled';
import 'tdesign-icons-web-components/esm/components/thumb-up';
import 'tdesign-icons-web-components/esm/components/thumb-down';
import 'tdesign-icons-web-components/esm/components/share-1';

import { Component, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { TdChatActionItem,TdChatActionProps, TdChatActionsName } from './type';

import styles from './style/action.less';

const className = `${getClassPrefix()}-chat-action`;

@tag('t-chat-action')
export default class ChatAction extends Component<TdChatActionProps> {
  static css = [styles];

  static propTypes = {
    actionBar: Object,
    onActions: Object,
  };

  private actions: TdChatActionItem[] = [
    { name: 'replay', render: <t-icon-refresh /> },
    { name: 'copy', render: <t-icon-copy /> },
    { name: 'good', render: <t-icon-thumb-up /> },
    { name: 'bad', render: <t-icon-thumb-down /> },
    { name: 'share', render: <t-icon-share-1 /> },
  ];

  private handleClickAction = (action: TdChatActionsName, e: MouseEvent) => {
    this.props?.onActions?.[action](e);
  };

  private defaultPresetActions: TdChatActionItem[] = this.actions.map((action) => ({
    name: action.name,
    render: (
      <div class={`${className}__actions__preset__wrapper`} onClick={(e) => this.handleClickAction(action.name, e)}>
        {action.render}
      </div>
    ),
  }));

  render(props: TdChatActionProps) {
    const { actionBar = true } = props;
    if (!actionBar) {
      return null;
    }

    const arrayActions: TdChatActionItem[] =
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
