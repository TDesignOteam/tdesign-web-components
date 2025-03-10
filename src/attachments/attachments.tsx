import '../filecard';
import 'tdesign-icons-web-components';

import { Component, createRef, tag } from 'omi';

import type { Attachment } from '..';
import { getClassPrefix } from '../_util/classname';
import classname from '../_util/classname';
import { StyledProps } from '../common';
import { TdAttachmentsProps } from './type';

import styles from './style/attachments.less';

export interface AttachmentsProps extends TdAttachmentsProps, StyledProps {}

const className = `${getClassPrefix()}-attachment`;
@tag('t-attachments')
export default class Attachments extends Component {
  static css = [styles];

  items: Attachment[] = [];

  overflow?: 'scrollX' | 'scrollY' | 'wrap';

  containerRef = createRef<HTMLElement>();

  installed() {
    // 初始化时检查滚动的状态
    this.updateButtonVisibility();
    // 监听手动滚动事件
    this.containerRef.current?.addEventListener('scroll', () => {
      this.updateButtonVisibility();
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

    // 保留1px容差防止小数计算问题
    this.showPrevButton = scrollLeft > 1;
    this.showNextButton = scrollLeft < maxScroll - 1;
    this.update();
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
    const childWidth =
      firstChild.offsetWidth + parseInt(childStyle.marginLeft, 10) + parseInt(childStyle.marginRight, 10) + 12;

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

  render(props: AttachmentsProps) {
    const { items, onRemove, class: classNames } = props;

    const listCls = `${className}-list`;
    return (
      <div class={classname(classNames, `${listCls}-wrap`)}>
        <o-transition-group
          ref={(e) => (this.containerRef.current = e)}
          class={classname(listCls, {
            [`${listCls}-overflow-${this.overflow}`]: this.overflow,
          })}
        >
          {items.map((item) => (
            <t-filecard
              key={item.uid}
              item={item}
              class="t-filecard-item"
              {...(onRemove && {
                onRemove: () => {
                  // 触发删除事件让父组件更新数据源
                  this.fire('remove', item);
                },
              })}
            ></t-filecard>
          ))}
        </o-transition-group>

        {this.overflow === 'scrollX' && this.showPrevButton && (
          <div class={`${listCls}-prev-btn`} onClick={() => this.onScrollOffset(-1)}>
            <t-icon name="chevron-left-circle" size="16px" />
          </div>
        )}
        {this.overflow === 'scrollX' && this.showNextButton && (
          <div class={`${listCls}-next-btn`} onClick={() => this.onScrollOffset(1)}>
            <t-icon name="chevron-right-circle" size="16px" />
          </div>
        )}
      </div>
    );
  }
}
