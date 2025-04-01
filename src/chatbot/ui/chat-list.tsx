import 'tdesign-icons-web-components/esm/components/arrow-down';
import './chat-item';

import { debounce, throttle } from 'lodash-es';
import { Component, createRef, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { TdChatListProps } from '../type';

import styles from '../style/chat-list.less';

const className = `${getClassPrefix()}-chat__list`;
@tag('t-chat-list')
export default class Chatlist extends Component<TdChatListProps> {
  static css = [styles];

  static propTypes = {
    autoScroll: Boolean,
    scrollToBottom: Boolean,
  };

  static defaultProps = {
    autoScroll: true,
    scrollToBottom: true,
  };

  private listRef = createRef<HTMLDivElement>();

  private scrollTopTmp = 0;

  private scrollHeightTmp = 0;

  private observer: MutationObserver = null;

  /** 主动滚动产生的阻止自动滚动标记 */
  private preventAutoScroll = false;

  /** 当前是否自动滚动 */
  private isAutoScrollEnabled = true;

  scrollButtonVisible = signal(false);

  /** 触发自动滚动 */
  private handleAutoScroll = throttle(() => {
    const { autoScroll } = this.props;
    if (!autoScroll || !this.isAutoScrollEnabled) {
      return;
    }
    this.scrollToBottom();
  }, 50);

  /** 检测自动滚动是否触发 */
  private checkAutoScroll = throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = this.listRef.current;
    const upScroll = scrollTop < this.scrollTopTmp ? true : false;

    // 用户主动上滚，取消自动滚动，标记为手动阻止
    if (upScroll) {
      this.isAutoScrollEnabled = false;
      this.preventAutoScroll = true;
    } else {
      const threshold = 50;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) <= threshold;
      // 如果手动阻止，必须滚动至底部阈值内才可恢复自动滚动
      if (this.preventAutoScroll) {
        if (isNearBottom) {
          this.isAutoScrollEnabled = true;
          this.preventAutoScroll = false;
        }
        // 未手动阻止，可触发自动滚动
      } else {
        this.isAutoScrollEnabled = true;
      }
    }
    this.scrollTopTmp = scrollTop;
  }, 100);

  /** 检测并显示滚到底部按钮 */
  private checkAndShowScrollButton = debounce(() => {
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
  }, 70);

  private handleScroll = (e) => {
    this.checkAutoScroll();
    this.checkAndShowScrollButton();
    this.props?.onScroll?.(e);
    this.fire('list_scroll', e);
  };

  ready(): void {
    const list = this.listRef.current;
    this.observer = new MutationObserver(() => {
      // 高度变化，触发滚动校验
      if (list?.scrollHeight !== this.scrollHeightTmp) {
        this.handleAutoScroll();
        this.checkAndShowScrollButton();
      }
      this.scrollHeightTmp = list?.scrollHeight;
    });
    if (list) {
      this.observer.observe(this.listRef.current, {
        subtree: true,
        childList: true,
      });
    }
  }

  uninstall(): void {
    this.observer.disconnect();
  }

  render() {
    return (
      <div ref={this.listRef} className={className} onScroll={this.handleScroll}>
        <div
          className={classname([
            `${className}__scroll__button`,
            {
              [`${className}__scroll__button--hide`]: !this.scrollButtonVisible.value,
            },
          ])}
          onClick={() => this.scrollToBottom({ behavior: 'smooth' })}
        >
          {convertToLightDomNode(<t-icon-arrow-down />)}
        </div>
        <slot></slot>
      </div>
    );
  }

  // 暴露给父组件的方法
  scrollToBottom(options: { behavior?: 'auto' | 'smooth' } = {}) {
    const list = this.listRef.current;
    if (list) {
      list.scrollTo({
        top: list.scrollHeight - list.clientHeight,
        behavior: options.behavior || 'auto',
      });
    }
  }
}
