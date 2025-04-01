import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';

import { throttle } from 'lodash-es';
import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';

import styles from '../style/auto-scroll.less';

const className = `${getClassPrefix()}-scroll`;

export interface TdAutoScrollProps {
  maxHeight?: number | string;
  /** 首次加载是否滚到底部，默认false */
  defaultScrollToBottom?: boolean;
}

@tag('t-auto-scroll')
export default class ChatThinking extends Component<TdAutoScrollProps> {
  static css = [styles];

  static propTypes = {
    maxHeight: [Number, String],
    defaultScrollToBottom: Boolean,
  };

  private scrollRef = createRef<HTMLDivElement>();

  private innerRef = createRef<HTMLDivElement>();

  private scrollTopTmp = 0;

  private observer: ResizeObserver = null;

  private scrollHeightTmp = 0;

  /** 主动滚动产生的阻止自动滚动标记 */
  private preventAutoScroll = false;

  /**
   * 当前是否自动滚动
   * 设为false初始化数据不触发滚动，否则进来就滚到底部了
   */
  private isAutoScrollEnabled = false;

  private scrollToBottom = (options: { behavior?: 'auto' | 'smooth' } = {}) => {
    const scroll = this.scrollRef.current;
    if (scroll) {
      scroll.scrollTo({
        top: scroll.scrollHeight - scroll.clientHeight,
        behavior: options.behavior || 'auto',
      });
    }
  };

  /** 触发自动滚动 */
  private handleAutoScroll = throttle(() => {
    if (!this.props.maxHeight || !this.isAutoScrollEnabled) {
      return;
    }
    this.scrollToBottom();
  }, 50);

  /** 检测自动滚动是否触发 */
  private checkAutoScroll = throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = this.scrollRef.current;
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

  private handleScroll = () => {
    this.checkAutoScroll();
  };

  install(): void {
    const { defaultScrollToBottom } = this.props;
    defaultScrollToBottom && (this.isAutoScrollEnabled = defaultScrollToBottom);
  }

  ready(): void {
    const scroll = this.scrollRef.current;
    const inner = this.innerRef.current;
    this.observer = new ResizeObserver(() => {
      // 内部高度变化，触发滚动校验
      if (scroll?.scrollHeight !== this.scrollHeightTmp) {
        this.handleAutoScroll();
      }
      this.scrollHeightTmp = scroll?.scrollHeight;
    });
    if (inner) {
      this.observer.observe(inner);
    }

    // 无论首次是否滚到底部，后续都正常触发自动滚动
    setTimeout(() => {
      this.isAutoScrollEnabled = true;
    }, 0);
  }

  uninstall(): void {
    this.observer.disconnect();
  }

  render(props: TdAutoScrollProps) {
    const { maxHeight } = props;
    return (
      <div
        ref={this.scrollRef}
        onScroll={this.handleScroll}
        style={{ 'max-height': maxHeight }}
        className={`${className}__wrapper`}
      >
        <div ref={this.innerRef} className={`${className}__inner`}>
          <slot></slot>
        </div>
      </div>
    );
  }
}
