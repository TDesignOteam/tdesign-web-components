import 'tdesign-icons-web-components/esm/components/add';
import 'tdesign-icons-web-components/esm/components/chevron-left';
import 'tdesign-icons-web-components/esm/components/chevron-right';
import './TabNavItem';
import './TabBar';

import { debounce, omit, toArray } from 'lodash-es';
import { Component, createRef, signal, tag, VNode } from 'omi';

import { calcMaxOffset, calcPrevOrNextOffset, calculateOffset, calcValidOffset } from '../_common/js/tabs/base';
import classname from '../_util/classname';
import noop from '../_util/noop';
import parseTNode from '../_util/parseTNode';
import { DragSortInnerProps } from '../_util/useDragSorter';
import { TabValue, TdTabPanelProps, TdTabsProps } from './type';
import { useTabClass } from './useTabClass';

interface TabNavProps extends TdTabsProps, DragSortInnerProps {
  itemList: TdTabPanelProps[];
  tabClick: (s: TabValue) => void;
  activeValue: TabValue;
  size?: 'medium' | 'large';
  children?: VNode;
}

@tag('t-tab-nav')
export default class TabNav extends Component<TabNavProps> {
  static defaultProps = {
    placement: 'top',
    itemList: [],
    tabClick: noop,
    scrollPosition: 'auto',
    size: 'medium',
    disabled: false,
    onRemove: noop,
    onChange: noop,
  };

  static propsType = {
    placement: String,
    itemList: Array,
    tabClick: Function,
    size: String,
    disabled: Boolean,
    onChange: Function,
    value: [String, Number],
    children: Array,
  };

  navsContainerRef = createRef<HTMLDivElement>();

  navsWrapRef = createRef<HTMLDivElement>();

  getIndex = (value: TabValue): number => {
    const index = toArray(this.props.itemList).findIndex((item) => item.value === value);
    return index > -1 ? index : -1;
  };

  // 判断滚动条是否需要展示
  canToLeft = signal(false);

  canToRight = signal(false);

  // 滚动条 ref 定义
  scrollBarRef = createRef<HTMLElement>();

  leftOperationsRef = createRef<HTMLElement>();

  rightOperationsRef = createRef<HTMLElement>();

  toLeftBtnRef = createRef<HTMLElement>();

  toRightBtnRef = createRef<HTMLElement>();

  scrollLeftSignal = signal(0);

  maxScrollLeft = 0;

  activeTab: HTMLElement | null = null;

  timeout: NodeJS.Timeout;

  setOffset = (offset: number) => {
    this.scrollLeftSignal.value = calcValidOffset(offset, this.maxScrollLeft);
  };

  getMaxScrollLeft = () => {
    if (['top', 'bottom'].includes(this.props.placement.toLowerCase())) {
      const maxOffset = calcMaxOffset({
        navsWrap: this.navsWrapRef.current,
        navsContainer: this.navsContainerRef.current,
        rightOperations: this.rightOperationsRef.current,
        toRightBtn: this.toRightBtnRef.current,
      });
      this.maxScrollLeft = maxOffset;
    }
  };

  moveActiveTabIntoView = () => {
    const offset = calculateOffset(
      {
        activeTab: this.activeTab,
        navsContainer: this.navsContainerRef.current,
        leftOperations: this.leftOperationsRef.current,
        rightOperations: this.rightOperationsRef.current,
      },
      this.scrollLeftSignal.value,
      this.props.scrollPosition,
    );
    this.setOffset(offset);
  };

  handleScroll = (action: 'prev' | 'next') => {
    const offset = calcPrevOrNextOffset(
      {
        activeTab: this.activeTab,
        navsContainer: this.navsContainerRef.current,
      },
      this.scrollLeftSignal.value,
      action,
    );
    this.setOffset(offset);
  };

  // FIXME: 滚动有延迟回弹
  private handleWheel = (e: WheelEvent) => {
    if (!this.canToLeft.value && !this.canToRight.value) return;
    e.preventDefault();

    const { deltaX, deltaY } = e;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.setOffset(this.scrollLeftSignal.value + deltaX);
    } else {
      this.setOffset(this.scrollLeftSignal.value + deltaY);
    }
  };

  private onResize = debounce(this.getMaxScrollLeft, 300);

  // FIXME: 非卡片状态下激活tab滚动调整有问题
  private onChangeActiveTab = () => {
    window.clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.moveActiveTabIntoView();
    }, 100);
  };

  effect = () => {
    setTimeout(() => {
      this.getMaxScrollLeft();
    }, 0);

    setTimeout(() => {
      if (['top', 'bottom'].includes(this.props.placement.toLowerCase())) {
        // 这里的 1 是小数像素不精确误差修正
        const canToLeft = this.scrollLeftSignal.value > 1;
        const canToRight = this.scrollLeftSignal.value < this.maxScrollLeft - 1;

        this.canToLeft.value = canToLeft;
        this.canToRight.value = canToRight;
      }
    }, 0);
  };

  installed(): void {
    this.effect();

    const scrollBar = this.scrollBarRef.current;
    scrollBar?.addEventListener('wheel', this.handleWheel, { passive: false });

    // handle window resize
    window.addEventListener('resize', this.onResize);
  }

  uninstall(): void {
    clearTimeout(this.timeout);

    this.scrollBarRef.current?.removeEventListener('wheel', this.handleWheel);

    window.removeEventListener('resize', this.onResize);
    this.onResize.cancel();
  }

  handleTabItemRemove = (removeItem) => {
    const { value: removeValue, index: removeIndex } = removeItem;
    if (removeValue === this.props.activeValue) {
      this.props.onChange(
        removeIndex === 0 ? this.props.itemList[removeIndex + 1]?.value : this.props.itemList[removeIndex - 1].value,
      );
      this.onChangeActiveTab();
    }
    this.props.onRemove(removeItem);
  };

  handleTabItemClick(clickItem) {
    if (clickItem.disabled) return;
    this.props.tabClick(clickItem.value);
    if (this.props.activeValue !== clickItem.value) {
      this.props.onChange(clickItem.value);
    }
    clickItem?.onClick?.(clickItem.value);
    this.onChangeActiveTab();
  }

  handleTabAdd = (e) => {
    this.props.onAdd({ e });
    this.onChangeActiveTab();
  };

  render(props: TabNavProps) {
    const {
      placement = 'top',
      itemList = [],
      disabled = false,
      activeValue,
      theme,
      addable,
      size,
      getDragProps,
    } = props;
    const activeIndex = this.getIndex(activeValue);
    const { tdTabsClassGenerator, tdClassGenerator, tdSizeClassGenerator } = useTabClass();
    const isCard = this.props.theme === 'card';
    this.effect();

    const TabBarCom = isCard ? null : (
      <t-tab-bar tabPosition={placement} activeId={activeIndex} containerRef={this.navsWrapRef} />
    );

    return (
      <div ref={this.navsContainerRef} className={classname(tdTabsClassGenerator('nav'))} style={{ minHeight: 48 }}>
        <div
          ref={this.leftOperationsRef}
          className={classname(tdTabsClassGenerator('operations'), tdTabsClassGenerator('operations--left'))}
        >
          {this.canToLeft.value ? (
            <div
              onClick={() => {
                this.handleScroll('prev');
              }}
              className={classname(
                tdTabsClassGenerator('btn'),
                tdTabsClassGenerator('btn--left'),
                tdSizeClassGenerator(size),
              )}
              ref={this.toLeftBtnRef}
            >
              <t-icon-chevron-left />
            </div>
          ) : null}
        </div>
        <div
          ref={this.rightOperationsRef}
          className={classname(tdTabsClassGenerator('operations'), tdTabsClassGenerator('operations--right'))}
        >
          {this.canToRight.value ? (
            <div
              onClick={() => {
                this.handleScroll('next');
              }}
              className={classname(
                tdTabsClassGenerator('btn'),
                tdTabsClassGenerator('btn--right'),
                tdSizeClassGenerator(size),
              )}
              ref={this.toRightBtnRef}
            >
              <t-icon-chevron-right />
            </div>
          ) : null}
          {addable ? (
            <div
              className={classname(
                tdTabsClassGenerator('add-btn'),
                tdTabsClassGenerator('btn'),
                tdSizeClassGenerator(size),
              )}
              onClick={this.handleTabAdd}
            >
              <t-icon-add />
            </div>
          ) : null}
          {this.props.action ? (
            <div
              className={classname(
                tdTabsClassGenerator('btn'),
                tdTabsClassGenerator('nav-action'),
                tdSizeClassGenerator(size),
              )}
            >
              {parseTNode(this.props.action)}
            </div>
          ) : null}
        </div>
        <div
          className={classname(
            tdTabsClassGenerator('nav-container'),
            isCard ? tdTabsClassGenerator('nav--card') : '',
            tdClassGenerator(`is-${placement}`),
            addable ? tdClassGenerator('is-addable') : '',
          )}
        >
          <div
            className={classname(
              tdTabsClassGenerator('nav-scroll'),
              this.canToLeft.value || this.canToRight.value ? tdClassGenerator('is-scrollable') : '',
            )}
            ref={this.scrollBarRef}
          >
            <div
              className={classname(
                tdTabsClassGenerator('nav-wrap'),
                ['left', 'right'].includes(placement) ? tdClassGenerator('is-vertical') : '',
                tdClassGenerator('is-smooth'),
              )}
              style={{ transform: `translate(${-this.scrollLeftSignal.value}px, 0)` }}
              ref={this.navsWrapRef}
            >
              {placement !== 'bottom' ? TabBarCom : null}
              {!isCard && (
                <div className={classname(tdTabsClassGenerator('bar'), tdClassGenerator(`is-${placement}`))} />
              )}
              {itemList.map((v, index) => (
                <t-tab-nav-item
                  {...omit(props, ['className', 'style'])}
                  {...v}
                  dragProps={{ ...getDragProps?.(index, v) }}
                  // 显式给 onRemove 赋值，防止 props 的 onRemove 事件透传
                  onRemove={v.onRemove}
                  key={v.value}
                  label={v.label}
                  isActive={activeValue === v.value}
                  theme={theme}
                  placement={placement}
                  index={index}
                  disabled={disabled || v.disabled}
                  onClick={() => {
                    this.handleTabItemClick(v);
                  }}
                  onTabRemove={this.handleTabItemRemove}
                  innerRef={(ref) => {
                    if (activeValue === v.value) {
                      this.activeTab = ref;
                    }
                  }}
                />
              ))}
              {placement === 'bottom' ? TabBarCom : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
