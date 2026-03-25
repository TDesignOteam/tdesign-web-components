import 'tdesign-icons-web-components/esm/components/arrow-down';
import '../chat-message';

import { debounce, throttle } from 'lodash-es';
import { Component, createRef, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { setExportparts } from '../_util/dom';
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
    hasMore: Boolean,
    loadMoreThreshold: Number,
  };

  static defaultProps = {
    autoScroll: true,
    defaultScrollTo: 'bottom',
    loadMoreThreshold: 80,
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

  /** 外部数据分页：用于滚动位置维持的 MutationObserver */
  private externalPagingObserver: MutationObserver = null;

  /** 外部数据分页：加载前的滚动高度，用于位置补偿 */
  private prevScrollHeightBeforeLoad = 0;

  /** 外部数据分页：加载前的滚动位置 */
  private prevScrollTopBeforeLoad = 0;

  /** 外部数据分页：是否正在等待 DOM 更新以修正滚动位置 */
  private waitingForDOMUpdate = false;

  /** 外部数据分页：内部加载状态标记，用于防止重复触发 loadMore */
  private isExternalLoading = signal(false);

  /** 触发自动滚动 */
  private handleAutoScroll = throttle(() => {
    const { autoScroll } = this.props;
    if (!autoScroll || !this.isAutoScrollEnabled) {
      return;
    }
    this.scrollList({
      to: 'bottom',
    });
  }, 50);

  /** 检测自动滚动是否触发 */
  private checkAutoScroll = throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = this.listRef.current;
    // 判断上滚：总高度未变更 && 滚动diff大于阈值
    const upScroll = scrollHeight === this.scrollHeightTmp && this.scrollTopTmp - scrollTop >= 10 ? true : false;

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
  }, 60);

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

  /** 检测是否滚动到顶部，触发外部数据分页加载 */
  private checkExternalLoadMore = throttle(() => {
    const { hasMore, loadMoreThreshold = 80 } = this.props;
    // 仅在外部数据分页模式下生效
    if (hasMore === undefined) return;
    if (!hasMore || this.isExternalLoading.value) return;

    const list = this.listRef.current;
    if (!list) return;

    if (list.scrollTop < loadMoreThreshold) {
      // 记录加载前的滚动状态，并标记为正在加载
      this.prevScrollHeightBeforeLoad = list.scrollHeight;
      this.prevScrollTopBeforeLoad = list.scrollTop;
      this.waitingForDOMUpdate = true;
      this.isExternalLoading.value = true;

      this.fire(
        'loadMore',
        {},
        {
          composed: true,
        },
      );
    }
  }, 200);

  private handleScroll = (e) => {
    this.checkAutoScroll();
    this.checkAndShowScrollButton();
    this.checkExternalLoadMore();
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

    // 外部数据分页模式：监听子元素变化，自动维持滚动位置
    if (this.props.hasMore !== undefined) {
      this.externalPagingObserver = new MutationObserver(() => {
        if (!this.waitingForDOMUpdate) return;
        this.waitingForDOMUpdate = false;
        this.isExternalLoading.value = false;

        // 在 DOM 更新后修正滚动位置，避免跳动
        const newScrollHeight = list?.scrollHeight || 0;
        const scrollDiff = newScrollHeight - this.prevScrollHeightBeforeLoad;
        if (list && scrollDiff > 0) {
          list.scrollTop = this.prevScrollTopBeforeLoad + scrollDiff;
          // 更新缓存，防止 checkAutoScroll 误判
          this.scrollHeightTmp = list.scrollHeight;
          this.scrollTopTmp = list.scrollTop;
        }
      });
      this.externalPagingObserver.observe(this, {
        childList: true,
        subtree: false,
      });
    }

    // defaultScrollTo="bottom" 的初始滚动：
    // 确保外部数据分页场景下，初始位置能正确滚动到底部
    if (defaultScrollTo === 'bottom') {
      requestAnimationFrame(() => {
        this.scrollList({ to: 'bottom' });
        // 初始化完成后记录滚动状态，防止 checkAutoScroll 误判
        this.scrollHeightTmp = list?.scrollHeight || 0;
        this.scrollTopTmp = list?.scrollTop || 0;
      });
    }

    setExportparts(this);
  }

  uninstall(): void {
    this.observer?.disconnect();
    this.externalPagingObserver?.disconnect();
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
            <t-icon-arrow-down className={`${className}__scroll__icon`} />
          </div>
        </div>
        {this.props.hasMore && (
          <slot name="load-more">
            <div className={`${className}__load-more`}>
              {this.isExternalLoading.value ? <span className={`${className}__load-more__spinner`} /> : null}
              <span className={`${className}__load-more__text`}>
                {this.isExternalLoading.value ? '加载中...' : '上滑加载更多'}
              </span>
            </div>
          </slot>
        )}
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
