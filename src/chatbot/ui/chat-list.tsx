import './chat-item';

import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import type { TdChatItemProps, TdChatListProps } from '../type';

import styles from '../style/chat-list.less';

const className = `${getClassPrefix()}-chat`;
@tag('t-chat-list')
export default class Chatlist extends Component<TdChatListProps> {
  static css = [styles];

  static propTypes = {
    data: Array,
    textLoading: Boolean,
    autoScroll: Boolean,
  };

  static defaultProps = {
    data: [],
    autoScroll: true,
  };

  listRef = createRef<HTMLDivElement>();

  render(props: { data: TdChatItemProps['message'][]; reverse?: boolean }) {
    const items = props.reverse ? [...props.data].reverse() : props.data;
    console.log('====items', items);
    return (
      <div ref={this.listRef} className={`${className}__list`} onScroll={this.handleScroll}>
        {items.map((item) => {
          // TODO: 看拿到哪里
          const { role, id } = item;
          const roleProps =
            role === 'user'
              ? {
                  variant: 'base',
                  placement: 'right',
                  avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
                }
              : {
                  variant: 'text',
                  placements: 'left',
                  avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
                  actions: (preset) => preset,
                  onAction: (e) => {
                    console.log('点击', e.detail);
                  },
                };
          return <t-chat-item {...roleProps} message={item} key={id} />;
        })}
      </div>
    );
  }

  updated() {
    // 下个循环触发滚动，否则滚动高度取不到最新
    setTimeout(() => {
      this.checkAndScrollToBottom();
    }, 0);
  }

  /** 检测并滚动到底部 */
  checkAndScrollToBottom = () => {
    const { data, autoScroll } = this.props;
    if (!autoScroll) {
      return;
    }
    const lastData = data[data.length - 1];
    // 消息生成中 / 发送消息时自动滚到底部
    if (lastData.status === 'pending' || lastData.status === 'streaming' || lastData.role !== 'assistant') {
      this.scrollToBottom();
    }
  };

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
