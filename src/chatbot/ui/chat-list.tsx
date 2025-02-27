import './chat-item';

import { Component, createRef, tag } from 'omi';

import type { TdChatItemProps, TdChatListProps } from '../type';

@tag('t-chat-list')
export default class Chatlist extends Component<TdChatListProps> {
  static css = [];

  static propTypes = {
    data: Array,
    reverse: Boolean,
  };

  listRef = createRef<HTMLDivElement>();

  render(props: { data: TdChatItemProps[]; reverse?: boolean }) {
    const items = props.reverse ? [...props.data].reverse() : props.data;
    console.log('====items', items);
    return (
      <div ref={this.listRef} className="t-chat-list space-y-4 overflow-y-auto" onScroll={this.handleScroll}>
        {items.map((item, index) => (
          <t-chat-item {...item} key={index} />
        ))}
      </div>
    );
  }

  private handleScroll = (e: Event) => {
    this.fire('scroll', e);
  };

  // 暴露给父组件的方法
  scrollToBottom(options: { behavior?: 'auto' | 'smooth' } = {}) {
    const list = this.listRef.current;
    if (list) {
      list.scrollTo({
        top: list.scrollHeight,
        behavior: options.behavior || 'smooth',
      });
    }
  }
}
