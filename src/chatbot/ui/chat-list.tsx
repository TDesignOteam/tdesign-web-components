import './chat-item';

import { Component, createRef, css, globalCSS, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import type { TdChatItemProps, TdChatListProps } from '../type';

import styles from '../style/chat-list.less';

globalCSS(css`
  ${styles}
`);

const className = `${getClassPrefix()}-chat`;
@tag('t-chat-list')
export default class Chatlist extends Component<TdChatListProps> {
  static css = `
    :host {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
  `;

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
