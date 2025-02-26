import { Component, tag } from 'omi';

import classname from '../../_util/classname';
import type { TdChatItemProps } from '../type';

@tag('t-chat-item')
export default class ChatItem extends Component<TdChatItemProps> {
  static css = [];

  static propTypes = {
    actions: Array,
    name: String,
    avatar: String,
    datetime: String,
    content: String,
    role: String,
    textLoading: Boolean,
    variant: String,
  };

  render(props: TdChatItemProps) {
    const baseClass = 't-chat-item flex gap-3 p-4';
    const roleClass = `t-chat-item-${props.role}`;
    const variantClass = props.variant ? `t-chat-item-${props.variant}` : '';
    return (
      <div className={classname(baseClass, roleClass, variantClass)}>
        <div className="t-chat-item-text">{props.content}</div>
      </div>
    );
  }

  private handleAction = (action: any, index: number) => {
    this.fire('action', { action, index });
  };
}
