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

  inject = ['messageStore'];

  private unsubscribe?: () => void;

  private messageId!: string;

  install() {
    this.messageId = this.props.id!;
    // 订阅特定消息的更新
    this.unsubscribe = this.injection.messageStore.subscribe(
      (state) => {
        const msg = state.messages[this.messageId];
        this.props.content = msg?.content;
        this.props.status = msg?.status;
        this.update();
      },
      [`messages.${this.messageId}.content`, `messages.${this.messageId}.status`],
    );
  }

  uninstall() {
    this.unsubscribe?.();
  }

  beforeUpdate() {}

  render(props: TdChatItemProps) {
    const baseClass = 't-chat-item flex gap-3 p-4';
    const roleClass = `t-chat-item-${props.role}`;
    const variantClass = props.variant ? `t-chat-item-${props.variant}` : '';
    console.log('===item render', props.id);
    return (
      <div className={classname(baseClass, roleClass, variantClass)}>
        <div className="t-chat-item-text think">{props.content?.thinking?.finalConclusion}</div>
        <div className="t-chat-item-text main">{props.content?.main?.text}</div>
      </div>
    );
  }

  private handleAction = (action: any, index: number) => {
    this.fire('action', { action, index });
  };
}
