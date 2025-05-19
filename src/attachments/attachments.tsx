import '../filecard';
import 'tdesign-icons-web-components/esm/components/chevron-left';
import 'tdesign-icons-web-components/esm/components/chevron-right';

import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import classname from '../_util/classname';
import { TdAttachmentsProps } from './type';

import styles from './style/attachments.less';

const className = `${getClassPrefix()}-attachment`;
@tag('t-attachments')
export default class Attachments extends Component<TdAttachmentsProps> {
  static css = [styles];

  static propTypes = {
    items: Array,
    overflow: String,
    onRemove: Function,
    onFileClick: Function,
    removable: Boolean,
    imageViewer: Boolean,
  };

  static defaultProps: Partial<TdAttachmentsProps> = {
    removable: true,
    imageViewer: true,
  };

  IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];

  containerRef = createRef<HTMLElement>();

  installed() {
    // 添加延迟确保DOM完全渲染
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.updateButtonVisibility();
        // 添加尺寸变化监听
        const resizeObserver = new ResizeObserver(() => {
          this.updateButtonVisibility();
        });
        if (this.containerRef.current) {
          resizeObserver.observe(this.containerRef.current);
        }
      });
    });

    // 监听手动滚动事件
    this.containerRef.current?.addEventListener('scroll', () => {
      this.updateButtonVisibility();
    });
  }

  updated() {
    // 在下一帧执行确保DOM更新完成
    requestAnimationFrame(() => {
      const prevShowPrev = this.showPrevButton;
      const prevShowNext = this.showNextButton;

      this.updateButtonVisibility();

      // 只有当按钮状态真正变化时才触发更新
      if (prevShowPrev !== this.showPrevButton || prevShowNext !== this.showNextButton) {
        this.update();
      }
    });
  }

  showPrevButton = false;

  showNextButton = true;

  // 更新按钮可见状态
  updateButtonVisibility = () => {
    const container = this.containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    // 计算新状态
    const newShowPrev = scrollLeft > 1;
    const newShowNext = scrollLeft < maxScroll - 1;

    // 只有当状态真正变化时才更新
    if (newShowPrev !== this.showPrevButton || newShowNext !== this.showNextButton) {
      this.showPrevButton = newShowPrev;
      this.showNextButton = newShowNext;
      this.update();
    }
  };

  // 滚动处理逻辑

  onScrollOffset = (offset: -1 | 1) => {
    const containerEle = this.containerRef.current;
    if (!containerEle) return;

    // 获取所有子元素
    const children = containerEle.querySelectorAll('t-filecard');
    if (!children.length) return;

    // 获取第一个子元素的宽度（包含外边距）
    const firstChild = children[0] as HTMLElement;
    const childStyle = window.getComputedStyle(firstChild);
    // 精确计算子元素总宽度（包含外边距和间距）
    const childWidth =
      firstChild.offsetWidth + parseInt(childStyle.marginLeft, 10) + parseInt(childStyle.marginRight, 10) + 12; // 12px来自flex布局的gap值

    // 计算可见区域能显示多少个子元素
    const containerWidth = containerEle.clientWidth;
    const visibleCount = Math.floor(containerWidth / childWidth);
    const scrollDistance = childWidth * visibleCount;

    const currentScroll = containerEle.scrollLeft;
    const maxScroll = containerEle.scrollWidth - containerWidth;
    let targetScrollLeft = 0;

    if (offset === 1) {
      // 向右滚动
      targetScrollLeft = Math.min(currentScroll + scrollDistance, maxScroll);

      // 处理最后不足一屏的情况
      if (maxScroll - targetScrollLeft < childWidth) {
        targetScrollLeft = maxScroll;
      }
    } else {
      // 向左滚动
      targetScrollLeft = Math.max(currentScroll - scrollDistance, 0);

      // 处理最后不足一屏的情况
      if (targetScrollLeft < childWidth) {
        targetScrollLeft = 0;
      }
    }

    // 执行平滑滚动
    containerEle.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });

    // 滚动结束后更新按钮状态
    setTimeout(() => this.updateButtonVisibility(), 500);
  };

  // 检查是否所有附件都是图片类型
  isAllImages(items: TdAttachmentsProps['items']) {
    return items?.every(
      (item) =>
        item.type?.startsWith('image/') || this.IMG_EXTS.includes(item.name?.split('.').pop()?.toLowerCase() || ''),
    );
  }

  render(props: TdAttachmentsProps) {
    const { items, overflow, removable, innerClass, imageViewer = true, style = {} } = props;
    const listCls = `${className}-list`;
    const allImages = this.isAllImages(items);
    return (
      <div class={classname(`${listCls}-wrap`, innerClass)}>
        <o-transition-group
          ref={(e) => (this.containerRef.current = e)}
          class={classname(listCls, {
            [`${listCls}-overflow-${overflow}`]: overflow,
          })}
        >
          {
            items.map((item, index) => (
              <t-filecard
                style={style}
                imageViewer={imageViewer}
                key={`${item.key || item.name}-${index}-${item.percent}-${item.status}` || `filecard-${index}`}
                item={item}
                cardType={allImages ? 'image' : 'file'}
                className={`t-filecard-item ${props?.className || ''}`}
                removable={removable}
                onFileClick={() => {
                  this.fire('file-click', item, {
                    composed: true,
                  });
                }}
                onRemove={() => {
                  this.fire('remove', item, {
                    composed: true,
                  });
                }}
              ></t-filecard>
            ))
          }
        </o-transition-group>

        {overflow === 'scrollX' && this.showPrevButton && (
          <div class={`${listCls}-prev-btn`} onClick={() => this.onScrollOffset(-1)}>
            <t-icon-chevron-left size="16px" />
          </div>
        )}
        {overflow === 'scrollX' && this.showNextButton && (
          <div class={`${listCls}-next-btn`} onClick={() => this.onScrollOffset(1)}>
            <t-icon-chevron-right size="16px" />
          </div>
        )}
      </div>
    );
  }
}
