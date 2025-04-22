import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';
import 'tdesign-icons-web-components/esm/components/thumb-up-filled';
import 'tdesign-icons-web-components/esm/components/thumb-down-filled';
import 'tdesign-icons-web-components/esm/components/thumb-up';
import 'tdesign-icons-web-components/esm/components/thumb-down';
import 'tdesign-icons-web-components/esm/components/share-1';

import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import type { TdChatItemAction, TdChatItemActionName } from '../chatbot/type';
import type { StyledProps, TNode } from '../common';
import { MessagePlugin } from '../message';
import { TdActionProps } from './type';

import styles from './style/action.less';

export interface ActionProps extends TdActionProps, StyledProps {}

const className = `${getClassPrefix()}-chat-action`;
@tag('t-chat-action')
export default class ChatAction extends Component<TdActionProps> {
  static css = [styles];

  containerRef = createRef<HTMLElement>();

  installed() {}

  actions: { name: TdChatItemActionName; icon: TNode }[] = [
    { name: 'replay', icon: <t-icon-refresh /> },
    { name: 'copy', icon: <t-icon-copy /> },
    { name: 'good', icon: <t-icon-thumb-up /> },
    { name: 'bad', icon: <t-icon-thumb-down /> },
    { name: 'goodActived', icon: <t-icon-thumb-up-filled /> },
    { name: 'badActived', icon: <t-icon-thumb-down-filled /> },
    { name: 'share', icon: <t-icon-share-1 /> },
  ];

  private handleClickAction = (action: TdChatItemActionName, data?: any, callback?: Function) => {
    if (this.props?.onActions?.[action]) {
      this.props.onActions[action](data, callback);
    } else {
      callback?.();
      if (action === 'copy') {
        MessagePlugin.success('复制成功');
      }
    }
  };

  presetActions: TdChatItemAction[] = this.actions.map((action) => ({
    name: action.name,
    render: (
      <div class={`${className}__actions__preset__wrapper`} onClick={() => this.handleClickAction(action.name)}>
        {action.icon}
      </div>
    ),
  }));

  render(props: ActionProps) {
    const { actionBar = true, presetActions } = props;
    if (!actionBar) {
      return null;
    }
    // 默认消息完成/暂停时才展示action
    // if (message.status !== 'complete' && message.status !== 'stop') {
    //   return null;
    // }
    const arrayActions: TdChatItemAction[] = Array.isArray(actionBar)
      ? actionBar.map((action) => this.presetActions.find((item) => item.name === action))
      : presetActions || this.presetActions;

    return (
      <div className={`${className}`}>
        {arrayActions.map((item) => (
            <span key={item.name} class={`${className}__item__wrapper`}>
              {item.render}
            </span>
          ))}
      </div>
    );
  }
}
