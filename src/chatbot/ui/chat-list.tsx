import 'tdesign-icons-web-components/esm/components/arrow-down';
import './chat-item';

import { debounce } from 'lodash-es';
import { Component, createRef, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { TdChatItemProps, TdChatListProps } from '../type';

import styles from '../style/chat-list.less';

const className = `${getClassPrefix()}-chat__list`;
@tag('t-chat-list')
export default class Chatlist extends Component<TdChatListProps> {
  static css = [styles];

  static propTypes = {
    data: Array,
    textLoading: Boolean,
    autoScroll: [Boolean, Number],
    scrollToBottom: Boolean,
  };

  static defaultProps = {
    data: [],
    autoScroll: true,
    scrollToBottom: true,
  };

  listRef = createRef<HTMLDivElement>();

  scrollButtonVisible = signal(false);

  /** 检测并滚动到底部 */
  checkAndScrollToBottom = () => {
    const { data, autoScroll } = this.props;
    if (typeof autoScroll === 'boolean' && !autoScroll) {
      return;
    }
    const lastData = data[data.length - 1];
    // 消息生成中 / 发送消息时自动滚到底部
    if (lastData.status === 'pending' || lastData.status === 'streaming' || lastData.role !== 'assistant') {
      // 传入阈值时，滚动高度小于阈值时才自动滚动
      if (typeof autoScroll === 'number') {
        const list = this.listRef.current;
        if (list.scrollHeight - list.clientHeight - list.scrollTop <= autoScroll) {
          this.scrollToBottom();
        }
      } else {
        this.scrollToBottom();
      }
    }
  };

  /** 检测并显示滚到底部按钮 */
  checkAndShowScrollButton = debounce(() => {
    const { scrollToBottom } = this.props;
    if (!scrollToBottom) {
      this.scrollButtonVisible.value = false;
      return;
    }
    const list = this.listRef.current;
    // 距离底部大于阈值 展示按钮
    if (list && list.scrollHeight - list.clientHeight - list.scrollTop > 140) {
      this.scrollButtonVisible.value = true;
    } else {
      this.scrollButtonVisible.value = false;
    }
  }, 100);

  installed(): void {
    this.checkAndShowScrollButton();
  }

  updated() {
    // 下个循环触发滚动，否则滚动高度取不到最新
    setTimeout(() => {
      this.checkAndScrollToBottom();
      this.checkAndShowScrollButton();
    }, 0);
  }

  render(props: { data: TdChatItemProps['message'][]; reverse?: boolean }) {
    const items = props.reverse ? [...props.data].reverse() : props.data;
    return (
      <div ref={this.listRef} className={className} onScroll={this.handleScroll}>
        <div
          className={classname([
            `${className}__scroll__button`,
            {
              [`${className}__scroll__button--hide`]: !this.scrollButtonVisible.value,
            },
          ])}
          onClick={() => this.scrollToBottom()}
        >
          {convertToLightDomNode(<t-icon-arrow-down />)}
        </div>
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

  private handleScroll = (e: Event) => {
    this.checkAndShowScrollButton();
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
