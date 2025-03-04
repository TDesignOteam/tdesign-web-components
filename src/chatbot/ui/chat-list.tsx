import './chat-item';

import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import styles from '../style/chat-list.less?inline';
import type { TdChatItemProps, TdChatListProps } from '../type';

const className = `${getClassPrefix()}-chat`;
@tag('t-chat-list')
export default class Chatlist extends Component<TdChatListProps> {
  static css = [styles];

  static propTypes = {
    data: Array,
    reverse: Boolean,
  };

  listRef = createRef<HTMLDivElement>();

  render(props: { data: TdChatItemProps[]; reverse?: boolean }) {
    const items = props.reverse ? [...props.data].reverse() : props.data;
    console.log('====list render', items);
    return (
      <div ref={this.listRef} className={`${className}__list`} onScroll={this.handleScroll}>
        {items.map((item) => {
          // TODO: 看拿到哪里
          const { role } = item;
          const roleProps =
            role === 'user'
              ? {
                  theme: 'primary',
                  variant: 'base',
                  placement: 'right',
                  avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
                }
              : {
                  theme: 'default',
                  variant: 'base',
                  placements: 'left',
                  avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
                };
          return <t-chat-item {...roleProps} {...item} key={item.id} />;
        })}
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
