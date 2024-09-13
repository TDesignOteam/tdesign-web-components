import 'tdesign-icons-web-components/esm/components/add';
import 'tdesign-icons-web-components/esm/components/chevron-left';
import 'tdesign-icons-web-components/esm/components/chevron-right';

import { toArray } from 'lodash';
import omit from 'lodash/omit';
import { Component, createRef, tag, VNode } from 'omi';

import classname from '../_util/classname';
import noop from '../_util/noop';
import { StyledProps } from '../common';
import TabBar from './TabBar';
import TabNavItem from './TabNavItem';
import { TabValue, TdTabPanelProps, TdTabsProps } from './type';
import { useTabClass } from './useTabClass';

interface TabNavProps extends TdTabsProps, StyledProps {
  itemList: TdTabPanelProps[];
  tabClick: (s: TabValue) => void;
  activeValue: TabValue;
  size?: 'medium' | 'large';
  children?: VNode;
}

@tag('t-tab-nav')
export default class TabNav extends Component<TabNavProps> {
  static defaultProps = {
    itemList: [],
    tabClick: noop,
    disabled: false,
    placement: 'top',
    size: 'medium',
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

  handleTabItemClick(clickItem) {
    if (clickItem.disabled) return;
    this.props.tabClick(clickItem.value);
    if (this.props.activeValue !== clickItem.value) {
      this.props.onChange(clickItem.value);
    }
    this.props.activeValue = clickItem.value;
    clickItem?.onClick?.(clickItem.value);
  }

  getIndex = (value: TabValue): number => {
    const index = toArray(this.props.itemList).findIndex((item) => item.value === value);
    return index > -1 ? index : -1;
  };

  render(props: TabNavProps) {
    const { placement = 'top', itemList = [], disabled = false, activeValue, theme, addable } = props;
    const activeIndex = this.getIndex(activeValue);
    const { tdTabsClassGenerator, tdClassGenerator } = useTabClass();
    const isCard = this.props.theme === 'card';

    const TabBarCom = isCard ? null : (
      <TabBar tabPosition={placement} activeId={activeIndex} containerRef={this.navsWrapRef} />
    );

    return (
      <div ref={this.navsContainerRef} classname={classname(tdTabsClassGenerator('nav'))} style={{ minHeight: 48 }}>
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
              tdTabsClassGenerator('nav-wrap'),
              ['left', 'right'].includes(placement) ? tdClassGenerator('is-vertical') : '',
              tdClassGenerator('is-smooth'),
            )}
            // style={{ transform: `translate(${-scrollLeft}px, 0)` }}
            ref={this.navsWrapRef}
          >
            {placement !== 'bottom' ? TabBarCom : null}
            {!isCard && <div className={classname(tdTabsClassGenerator('bar'), tdClassGenerator(`is-${placement}`))} />}
            {itemList.map((v, index) => (
              <TabNavItem
                {...omit(props, ['className', 'style'])}
                {...v}
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
                // onTabRemove={handleTabItemRemove}
                // innerRef={(ref) => {
                //   if (activeValue === v.value) {
                //     setActiveTab(ref);
                //   }
                // }}
              />
            ))}
            {placement === 'bottom' ? TabBarCom : null}
          </div>
        </div>
      </div>
    );
  }
}
