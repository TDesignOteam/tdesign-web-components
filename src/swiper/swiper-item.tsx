import { Component, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { TNode } from '../common';
import { TdSwiperProps } from './type';

export interface SwiperItemProps extends TdSwiperProps {
  index?: number;
  children?: TNode;
  currentIndex?: number;
  isSwitching?: boolean;
  swiperItemLength?: number;
  getWrapAttribute?: (attr: string) => any;
}

@tag('t-swiper-item')
export default class SwiperItem extends Component<SwiperItemProps> {
  static defaultProps: SwiperItemProps = {
    isSwitching: false,
    swiperItemLength: 0,
    duration: 300,
    type: 'default',
  };

  className = `${classPrefix}-swiper-item`;

  itemWidth = 0.415; // 依据设计稿使用t-swiper__card控制每个swiper的宽度为41.5%

  CARD_SCALE = 210 / 332; // 缩放比例

  get active() {
    return this.props.index === this.props.currentIndex;
  }

  get disposeIndex() {
    if (this.props.type !== 'card') return 0;
    if (this.props.currentIndex === 0 && this.props.index === this.props.swiperItemLength - 1) {
      return -1;
    }
    if (this.props.currentIndex === this.props.swiperItemLength - 1 && this.props.index === 0) {
      return this.props.swiperItemLength;
    }
    if (
      this.props.index < this.props.currentIndex - 1 &&
      this.props.currentIndex - this.props.index >= this.props.swiperItemLength / 2
    ) {
      return this.props.swiperItemLength + 1;
    }
    if (
      this.props.index > this.props.currentIndex + 1 &&
      this.props.index - this.props.currentIndex >= this.props.swiperItemLength / 2
    ) {
      return -2;
    }
    return this.props.index;
  }

  get translateX() {
    if (this.props.type !== 'card') return 0;
    const wrapWidth = this.props.getWrapAttribute('offsetWidth') || 0;
    const translateIndex = !this.active && this.props.swiperItemLength > 2 ? this.disposeIndex : this.props.index;
    const inStage = Math.abs(translateIndex - this.props.currentIndex) <= 1;
    if (inStage) {
      return (
        (wrapWidth *
          ((translateIndex - this.props.currentIndex) * (1 - this.itemWidth * this.CARD_SCALE) - this.itemWidth + 1)) /
        2
      );
    }
    if (translateIndex < this.props.currentIndex) {
      return (-this.itemWidth * (1 + this.CARD_SCALE) * wrapWidth) / 2;
    }
    return ((2 + this.itemWidth * (this.CARD_SCALE - 1)) * wrapWidth) / 2;
  }

  get zIndex() {
    if (this.props.type !== 'card') return 0;
    const translateIndex = !this.active && this.props.swiperItemLength > 2 ? this.disposeIndex : this.props.index;
    const isActivity = translateIndex === this.props.currentIndex;
    const inStage = Math.round(Math.abs(translateIndex - this.props.currentIndex)) <= 1;
    if (isActivity) {
      return 2;
    }
    if (inStage) {
      return 1;
    }
    return 0;
  }

  get itemStyle() {
    if (this.props.animation === 'fade') {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: this.active ? 1 : 0,
        transition: this.props.isSwitching ? `opacity ${this.props.duration / 1000}s` : '',
        zIndex: this.active ? 1 : 0,
      };
    }
    if (this.props.type === 'card') {
      const translateIndex = !this.active && this.props.swiperItemLength > 2 ? this.disposeIndex : this.props.index;
      const isActivity = translateIndex === this.props.currentIndex;
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '41.5%',
        height: '100%',
        transform: `translateX(${this.translateX}px) scale(${isActivity ? 1 : this.CARD_SCALE})`,
        transition: `transform ${this.props.duration / 1000}s ease`,
        zIndex: this.zIndex,
      };
    }
    return {};
  }

  render() {
    const { animation, type } = this.props;
    return (
      <div
        className={classname([
          `${classPrefix}-swiper__container__item`,
          {
            [`${classPrefix}-swiper__card`]: type === 'card',
            [`${classPrefix}-is-active`]: type === 'card' && this.active,
            [`${classPrefix}-swiper__fade`]: animation === 'fade',
          },
        ])}
        style={this.itemStyle}
      >
        {this.props.children}
      </div>
    );
  }
}
