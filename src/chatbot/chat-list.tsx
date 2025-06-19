import 'tdesign-icons-web-components/esm/components/arrow-down';
import '../chat-message';

import { debounce, throttle } from 'lodash-es';
import { Component, createRef, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { setExportparts } from '../_util/dom';
import { convertToLightDomNode } from '../_util/lightDom';
import type { TdChatListProps, TdChatListScrollToOptions } from './type';

import styles from './style/chat-list.less';

const className = `${getClassPrefix()}-chat__list`;
@tag('t-chat-list')
export default class Chatlist extends Component<TdChatListProps> {
  static css = [styles];

  static propTypes = {
    autoScroll: Boolean,
    defaultScrollTo: String,
    onScroll: Function,
  };

  static defaultProps = {
    autoScroll: true,
    defaultScrollTo: 'bottom',
  };

  private listRef = createRef<HTMLDivElement>();

  private innerRef = createRef<HTMLDivElement>();

  private scrollTopTmp = 0;

  private scrollHeightTmp = 0;

  private observer: ResizeObserver = null;

  /** 主动滚动产生的阻止自动滚动标记 */
  private preventAutoScroll = false;

  /**
   * 当前是否自动滚动
   * 设为false初始化数据不触发滚动，否则进来就滚到底部了
   */
  private isAutoScrollEnabled = false;

  scrollButtonVisible = signal(false);

  /** 触发自动滚动 */
  private handleAutoScroll = throttle(() => {
    const { autoScroll } = this.props;
    if (!autoScroll || !this.isAutoScrollEnabled) {
      return;
    }
    this.scrollTo();
  }, 50);

  /** 检测自动滚动是否触发 */
  private checkAutoScroll = throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = this.listRef.current;
    // 上滚检测给一个小阈值，避免生成过程中样式变更造成误触
    const upScroll = this.scrollTopTmp - scrollTop >= 10 ? true : false;

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
    this.fire(
      'scroll',
      {
        scrollTop: e.target.scrollTop,
      },
      {
        composed: true,
      },
    );
  };

  ready(): void {
    const { defaultScrollTo } = this.props;
    defaultScrollTo === 'bottom' && (this.isAutoScrollEnabled = true);

    const list = this.listRef.current;
    const inner = this.innerRef.current;
    this.observer = new ResizeObserver(() => {
      // 高度变化，触发滚动校验
      if (list?.scrollHeight !== this.scrollHeightTmp) {
        this.handleAutoScroll();
        this.checkAndShowScrollButton();
      }
      this.scrollHeightTmp = list?.scrollHeight;
    });
    if (inner) {
      this.observer.observe(inner);
    }
    setExportparts(this);
  }

  uninstall(): void {
    this.observer.disconnect();
  }

  render() {
    return (
      <div ref={this.listRef} className={className} onScroll={this.handleScroll}>
        <div
          className={classname([
            `${className}__scroll__button__container`,
            {
              [`${className}__scroll__button__container--hide`]: !this.scrollButtonVisible.value,
            },
          ])}
        >
          <div
            className={classname([`${className}__scroll__button`])}
            onClick={() => this.scrollList({ behavior: 'smooth', to: 'bottom' })}
          >
            {convertToLightDomNode(<t-icon-arrow-down />)}
          </div>
        </div>
        <div ref={this.innerRef}>
          <slot></slot>
        </div>
      </div>
    );
  }

  // 受控滚动，暴露给父组件的方法
  scrollList(options?: TdChatListScrollToOptions) {
    const list = this.listRef.current;
    if (!list) return;
    const { behavior, to } = options;
    list.scrollTo({
      top: to === 'bottom' ? list.scrollHeight - list.clientHeight : 0,
      behavior,
    });
  }
}
