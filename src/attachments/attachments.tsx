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

const TOLERANCE = 1;
const className = `${getClassPrefix()}-attachment`;
@tag('t-attachments')
export default class Attachments extends Component {
  static css = [styles];

  items: Attachment[] = [];

  overflow?: 'scrollX' | 'scrollY' | 'wrap';

  containerRef = createRef<HTMLElement>();

  // 滚动处理逻辑

  onScrollOffset = (offset: -1 | 1) => {
    const containerEle = this.containerRef.current;
    if (!containerEle) return;

    // 计算整行滚动
    const containerWidth = containerEle.clientWidth;
    const currentScroll = containerEle.scrollLeft;
    let targetScrollLeft = 0;
    if (offset === 1) {
      // 向右滚动
      const maxScroll = containerEle.scrollWidth - containerWidth;
      targetScrollLeft = Math.min(currentScroll + containerWidth, maxScroll);

      // 到达最右边时停止
      if (currentScroll >= maxScroll - TOLERANCE) {
        return;
      }
    } else {
      // 向左滚动
      targetScrollLeft = Math.max(currentScroll - containerWidth, 0);

      // 到达最左边时停止
      if (currentScroll <= TOLERANCE) {
        return;
      }
    }

    // 执行平滑滚动
    containerEle.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
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

        {this.overflow === 'scrollX' && [
          <div class={`${listCls}-prev-btn`} onClick={() => this.onScrollOffset(-1)}>
            <t-icon name="chevron-left-circle" size="16px" />
          </div>,
          <div class={`${listCls}-next-btn`} onClick={() => this.onScrollOffset(1)}>
            <t-icon name="chevron-right-circle" size="16px" />
          </div>,
        ]}
      </div>
    );
  }
}
