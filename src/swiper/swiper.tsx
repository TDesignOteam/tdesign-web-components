import 'tdesign-icons-web-components/esm/components/chevron-right';
import 'tdesign-icons-web-components/esm/components/chevron-left';
import './swiper-item';

import { isEqual } from 'lodash';
import { bind, cloneElement, Component, createRef, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { getChildrenArray } from '../_util/component';
import { StyledProps, TNode } from '../common';
import { SwiperChangeSource, SwiperNavigation, TdSwiperProps } from './type';

export interface SwiperProps extends TdSwiperProps, StyledProps {
  children?: TNode[];
}

const isTNode = (value: any) => !!value && !!value.nodeName;

@tag('t-swiper')
export default class Swiper extends Component<SwiperProps> {
  static defaultNavigation: SwiperNavigation = {
    placement: 'inside',
    showSlideBtn: 'always',
    size: 'medium',
    type: 'bars',
  };

  static defaultProps: SwiperProps = {
    animation: 'slide',
    autoplay: true,
    current: 0,
    direction: 'horizontal',
    duration: 300,
    interval: 5000,
    loop: true,
    stopOnHover: true,
    trigger: 'hover',
    type: 'default',
    navigation: Swiper.defaultNavigation,
  };

  static propTypes = {
    animation: String,
    autoplay: Boolean,
    current: Number,
    direction: String,
    duration: Number,

    height: Number,
    interval: Number,
    loop: Boolean,
    stopOnHover: Boolean,
    trigger: String,
    type: String,
    navigation: [String, Number, Object, Function],

    onChange: Function,
  };

  className = `${classPrefix}-swiper`;

  itemStyle = 'width: 100%; display: flex; flex: 0 0 auto;';

  swiperWrapRef = createRef<HTMLElement>();

  currentIndex = signal(this.props.current);

  navActiveIndex = signal(this.props.current);

  showArrow = false;

  isSwitching = signal(false);

  lastIsSwitching = false;

  lastCurrent = this.props.current;

  lastPropsToUpdateSetTimer = [this.props.autoplay, this.currentIndex.value, this.props.duration, this.props.interval];

  isHovering = signal(false);

  swiperSwitchingTimer: NodeJS.Timeout | number = 0;

  isBeginToEnd = false;

  isEndToBegin = false;

  swiperTimer: ReturnType<typeof setTimeout> | null = null;

  swiperItemLength = signal(0);

  get navigationConfig() {
    if (!isTNode(this.props.navigation)) {
      return { ...Swiper.defaultNavigation, ...(this.props.navigation as SwiperNavigation) };
    }
    return null;
  }

  get isEnd() {
    if (this.props.type === 'card') {
      return !this.props.loop && this.currentIndex.value + 1 >= this.swiperItemLength.value;
    }
    return !this.props.loop && this.currentIndex.value + 2 >= this.swiperItemLength.value;
  }

  get propsToUpdateSetTimer() {
    return [this.props.autoplay, this.currentIndex.value, this.props.duration, this.props.interval];
  }

  get swiperWrapClass() {
    return {
      [`${classPrefix}-swiper__wrap`]: true,
      [`${classPrefix}-swiper--inside`]: this.navigationConfig.placement === 'inside',
      [`${classPrefix}-swiper--outside`]: this.navigationConfig.placement === 'outside',
      [`${classPrefix}-swiper--vertical`]: this.props.direction === 'vertical',
      [`${classPrefix}-swiper--large`]: this.navigationConfig.size === 'large',
      [`${classPrefix}-swiper--small`]: this.navigationConfig.size === 'small',
    };
  }

  get containerStyle() {
    const offsetHeight = this.props.height ? `${this.props.height}px` : `${this.getWrapAttribute('offsetHeight')}px`;

    if (this.props.type === 'card' || this.props.animation === 'fade') {
      return {
        height: offsetHeight,
      };
    }

    if (this.props.animation === 'slide') {
      const style: Record<string, number | string> = {
        transition: this.isSwitching.value ? `transform ${this.props.duration / 1000}s ease` : '',
      };
      let active = this.currentIndex.value;
      if (this.swiperItemLength.value > 1) {
        active += 1;
        if (this.isBeginToEnd || this.isEndToBegin) {
          style.transition = '';
        }
      }

      if (this.props.direction === 'vertical') {
        style.height = offsetHeight;
        style.transform = `translate3d(0, -${active * 100}%, 0px)`;
      } else {
        console.log(active);
        style.transform = `translate3d(-${active * 100}%, 0px, 0px)`;
      }
      ['msTransform', 'WebkitTransform'].forEach((key) => {
        style[key] = style.transform;
      });

      return style;
    }
    return {};
  }

  @bind
  swiperTo(index: number, context: { source: SwiperChangeSource }) {
    let targetIndex = index % this.swiperItemLength.value;
    this.navActiveIndex.value = targetIndex;
    this.fire('update:current', targetIndex);
    this.props.onChange?.(targetIndex, context);
    this.isSwitching.value = true;

    if (this.props.animation === 'slide' && this.swiperItemLength.value > 1 && this.props.type !== 'card') {
      targetIndex = index;
      this.isBeginToEnd = false;
      this.isEndToBegin = false;
      if (index >= this.swiperItemLength.value) {
        this.clearTimer();
        setTimeout(() => {
          this.isEndToBegin = true;
          this.currentIndex.value = 0;
        }, this.props.duration);
      }
      if (this.currentIndex.value === 0) {
        if (
          (this.swiperItemLength.value > 2 && index === this.swiperItemLength.value - 1) ||
          (this.swiperItemLength.value === 2 && index === 0)
        ) {
          targetIndex = -1;
          this.navActiveIndex.value = this.swiperItemLength.value - 1;
          this.clearTimer();
          setTimeout(() => {
            this.isBeginToEnd = true;
            this.currentIndex.value = this.swiperItemLength.value - 1;
          }, this.props.duration);
        }
      }
    }

    this.currentIndex.value = targetIndex;
    console.log(this.currentIndex.value);
  }

  @bind
  clearTimer() {
    if (this.swiperTimer) {
      clearTimeout(this.swiperTimer);
      this.swiperTimer = null;
    }
  }

  @bind
  setTimer() {
    if (this.props.autoplay && this.props.interval > 0) {
      this.clearTimer();
      this.swiperTimer = setTimeout(
        () => {
          this.swiperTo(this.currentIndex.value + 1, { source: 'autoplay' });
        },
        this.currentIndex.value === 0 ? this.props.interval - (this.props.duration + 50) : this.props.interval,
      );
    }
  }

  @bind
  onMouseEnter() {
    this.isHovering.value = true;
    if (this.props.stopOnHover) {
      this.clearTimer();
    }
    if (this.navigationConfig.showSlideBtn === 'hover') {
      this.showArrow = true;
      this.update();
    }
  }

  @bind
  onMouseLeave() {
    this.isHovering.value = false;
    if (!this.isEnd) {
      this.setTimer();
    }
    if (this.navigationConfig.showSlideBtn === 'hover') {
      this.showArrow = false;
      this.update();
    }
  }

  @bind
  onMouseEnterNavigationItem(i: number) {
    if (this.props.trigger === 'hover') {
      this.swiperTo(i, { source: 'hover' });
    }
  }

  @bind
  onClickNavigationItem(i: number) {
    if (this.props.trigger === 'hover') {
      this.swiperTo(i, { source: 'hover' });
    }
  }

  @bind
  goNext(context: { source: SwiperChangeSource }) {
    if (this.isSwitching.value) return;
    if (this.props.type === 'card') {
      return this.swiperTo(
        this.currentIndex.value + 1 >= this.swiperItemLength.value ? 0 : this.currentIndex.value + 1,
        context,
      );
    }
    return this.swiperTo(this.currentIndex.value + 1, context);
  }

  @bind
  goPrevious(context: { source: SwiperChangeSource }) {
    if (this.isSwitching.value) return;
    if (this.currentIndex.value - 1 < 0) {
      if (this.props.animation === 'slide' && this.swiperItemLength.value === 2) {
        return this.swiperTo(0, context);
      }
      return this.swiperTo(this.swiperItemLength.value - 1, context);
    }
    return this.swiperTo(this.currentIndex.value - 1, context);
  }

  @bind
  getWrapAttribute(attr: string) {
    return this.swiperWrapRef.current?.[attr];
  }

  @bind
  renderArrow() {
    if (!this.showArrow) return null;
    return (
      <div className={classname([`${classPrefix}-swiper__arrow`, `${classPrefix}-swiper__arrow--default`])}>
        <div className={`${classPrefix}-swiper__arrow-left`} onClick={() => this.goPrevious({ source: 'click' })}>
          <t-icon-chevron-left size="20px" />
        </div>
        <div className={`${classPrefix}-swiper__arrow-right`} onClick={() => this.goNext({ source: 'click' })}>
          <t-icon-chevron-right size="20px" />
        </div>
      </div>
    );
  }

  @bind
  renderPagination() {
    const fractionIndex = this.currentIndex.value + 1 > this.swiperItemLength.value ? 1 : this.currentIndex.value + 1;
    return (
      <div class={`${classPrefix}-swiper__arrow`}>
        <div class={`${classPrefix}-swiper__arrow-left`} onClick={() => this.goPrevious({ source: 'click' })}>
          <t-icon-chevron-left size="20px" />
        </div>
        <div class={`${classPrefix}-swiper__navigation-text-fraction`}>
          {fractionIndex}/{this.swiperItemLength.value}
        </div>
        <div class={`${classPrefix}-swiper__arrow-right`} onClick={() => this.goNext({ source: 'click' })}>
          <t-icon-chevron-right size="20px" />
        </div>
      </div>
    );
  }

  @bind
  renderNavigation() {
    if (isTNode(this.props.navigation)) return this.props.navigation;

    if (this.navigationConfig.type === 'fraction') {
      return (
        <div
          className={classname([`${classPrefix}-swiper__navigation`, `${classPrefix}-swiper__navigation--fraction`])}
        >
          {this.renderPagination()}
        </div>
      );
    }
    const swiperItemList = getChildrenArray(this.props.children).filter((child) => child.nodeName === 't-swiper-item');
    return (
      <ul
        className={classname([
          `${classPrefix}-swiper__navigation`,
          {
            [`${classPrefix}-swiper__navigation-bars`]: this.navigationConfig.type === 'bars',
            [`${classPrefix}-swiper__navigation-dots`]: this.navigationConfig.type === 'dots',
            [`${classPrefix}-swiper__navigation-dots-bar`]: this.navigationConfig.type === 'dots-bar',
          },
        ])}
      >
        {swiperItemList.map((_, i: number) => (
          <li
            key={i}
            className={classname([
              `${classPrefix}-swiper__navigation-item`,
              {
                [`${classPrefix}-is-active`]: i === this.navActiveIndex.value,
              },
            ])}
            onMouseenter={() => this.onMouseEnterNavigationItem(i)}
            onClick={() => this.onClickNavigationItem(i)}
          >
            <span></span>
          </li>
        ))}
      </ul>
    );
  }

  @bind
  renderSwiperItems() {
    const swiperItemList = getChildrenArray(this.props.children).filter((child) => child.nodeName === 't-swiper-item');
    this.swiperItemLength.value = swiperItemList.length;
    const items = swiperItemList.map((swiperItem: any, index) => {
      const p = { ...this.props, ...swiperItem.props };
      return (
        <t-swiper-Item
          index={index}
          currentIndex={this.currentIndex.value}
          isSwitching={this.isSwitching.value}
          getWrapAttribute={this.getWrapAttribute}
          swiperItemLength={this.swiperItemLength.value}
          style={this.itemStyle}
          {...p}
        >
          {swiperItem.children}
        </t-swiper-Item>
      );
    });
    if (this.props.animation === 'slide' && items.length > 1) {
      const first = cloneElement(items[0], {
        key: `swiper-item-append-${0}`,
      });
      const last = cloneElement(items[items.length - 1], {
        key: `swiper-item-prepend-${items.length - 1}`,
      });
      items.unshift(last);
      items.push(first);
    }
    return items;
  }

  @bind
  init() {
    this.setTimer();
    this.showArrow = this.navigationConfig.showSlideBtn === 'always';
  }

  install(): void {
    this.init();
  }

  beforeUpdate(): void {
    if (this.lastIsSwitching !== this.isSwitching.value) {
      if (this.isSwitching.value) {
        if (this.swiperSwitchingTimer) clearTimeout(this.swiperSwitchingTimer);
        this.swiperSwitchingTimer = setTimeout(() => {
          this.isSwitching.value = false;
          this.swiperSwitchingTimer = 0;
          if (this.isEnd) {
            this.clearTimer();
          }
        }, this.props.duration + 50);
      }
      this.lastIsSwitching = this.isSwitching.value;
    }
    if (this.props.current !== this.lastCurrent && this.props.current !== this.navActiveIndex.value) {
      this.swiperTo(this.props.current, { source: 'autoplay' });
      this.lastCurrent = this.props.current;
    }
    if (!isEqual(this.propsToUpdateSetTimer, this.lastPropsToUpdateSetTimer)) {
      this.setTimer();
      this.lastPropsToUpdateSetTimer = this.propsToUpdateSetTimer;
    }
  }

  render(props: SwiperProps): TNode {
    const { animation, type } = props;
    return (
      <div
        className={classname(`${classPrefix}-swiper`)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref={this.swiperWrapRef}
      >
        <div className={classname(this.swiperWrapClass)}>
          <div
            className={classname(`${classPrefix}-swiper__content`, {
              [`${classPrefix}-swiper-fade`]: animation === 'fade',
              [`${classPrefix}-swiper-card`]: type === 'card',
            })}
          >
            <div className={`${classPrefix}-swiper__container`} style={this.containerStyle}>
              {this.renderSwiperItems()}
            </div>
          </div>
          {this.renderNavigation()}
          {this.renderArrow()}
        </div>
      </div>
    );
  }
}
