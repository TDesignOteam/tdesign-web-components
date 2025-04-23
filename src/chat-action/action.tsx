import { Component, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import type { StyledProps, TNode } from '../common';
import { TdActionProps } from './type';
import type { TDChatItemAction, TDChatItemActionName } from '../chatbot/type';

import 'tdesign-icons-web-components/esm/components/refresh';
import 'tdesign-icons-web-components/esm/components/copy';
import 'tdesign-icons-web-components/esm/components/thumb-up-filled';
import 'tdesign-icons-web-components/esm/components/thumb-down-filled';
import 'tdesign-icons-web-components/esm/components/thumb-up';
import 'tdesign-icons-web-components/esm/components/thumb-down';
import 'tdesign-icons-web-components/esm/components/share-1';

import styles from './style/action.less';

export interface ActionProps extends TdActionProps, StyledProps {}

const className = `${getClassPrefix()}-chat-action`;
@tag('t-chat-action')
export default class ChatAction extends Component<TdActionProps> {
  static css = [styles];

  actions: {name:TDChatItemActionName, icon: TNode, condition?: (message: any) => boolean;}[] = [
    {name: 'replay', icon: <t-icon-refresh />},
    {name: 'copy', icon: <t-icon-copy />},
    {name: 'good', icon: <t-icon-thumb-up />},
    {name: 'bad', icon: <t-icon-thumb-down />},
    {name: 'goodActived', icon: <t-icon-thumb-up-filled />},
    {name: 'badActived', icon: <t-icon-thumb-down-filled />},
    {name: 'share', icon: <t-icon-share-1 />},
  ]

  private handleClickAction = (action: TDChatItemActionName, data?: any, callback?: Function) => {
    if (this.props?.onActions?.[action]) {
      this.props.onActions[action](data, callback);
    } else {
      callback?.();
    }
  };

  presetActions: TDChatItemAction[] = this.actions.map((action) => ({
      name: action.name,
      render: (
        <div class={`${className}__actions__preset__wrapper`} onClick={() => this.handleClickAction(action.name)}>
          {action.icon}
        </div>
      ),
      condition:action?.condition,
  }));


  render(props: ActionProps) {
    const { actionBar = true, presetActions, message = {} } = this.props;
    if (!actionBar) {
      return null;
    }
    let arrayActions: TDChatItemAction[] = Array.isArray(actionBar) 
      ? actionBar.map((action)=>this.presetActions.find((item)=>item.name === action)) 
      : (presetActions || this.presetActions);


    return (
      <div className={`${className}`}>
        {arrayActions.map((item) => {
          if (item.condition && !item.condition(message)) {
            return null;
          }
          return (
            <span key={item.name} class={`${className}__item__wrapper`}>
              {item.render}
            </span>
          );
        })}
      </div>
    );
  }
}
