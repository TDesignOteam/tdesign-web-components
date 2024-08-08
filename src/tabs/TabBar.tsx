import { toArray } from 'lodash';
import { Component, createRef, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { StyledProps, Styles } from '../common';
import { TabValue } from './type';

interface TabBarProps extends StyledProps {
  tabPosition: string;
  activeId: TabValue;
  containerRef: Object;
}

@tag('t-tab-bar')
export default class TabBar extends Component<TabBarProps> {
  static defaultProps = {
    tabPosition: 'top',
    activeId: '',
  };

  static propsType = {
    tabPosition: String,
    activeId: [String, Number],
    containerRef: Object,
  };

  currentActiveIdRef = createRef<TabValue>();

  barStyle: Styles;

  tabsClassPrefix = `${classPrefix}-tabs`;

  tabPosition: string;

  containerRef = createRef<HTMLDivElement>();

  computeStyle() {
    const isHorizontal = ['bottom', 'top'].includes(this.props.tabPosition);
    const transformPosition = isHorizontal ? 'translateX' : 'translateY';
    const itemProp = isHorizontal ? 'width' : 'height';
    const barBorderProp = isHorizontal ? 'width' : 'height';

    let offset = 0;
    if (this.containerRef.current) {
      const itemsRef = toArray(this.containerRef.current.querySelectorAll<HTMLElement>('t-tab-nav-item'));
      if (itemsRef.length - 1 >= Number(this.currentActiveIdRef.current)) {
        itemsRef.forEach((item, itemIndex) => {
          if (itemIndex < Number(this.currentActiveIdRef.current)) {
            offset += Number(getComputedStyle(item)[itemProp].replace('px', ''));
          }
        });
        const computedItem = itemsRef[Number(this.currentActiveIdRef.current)];
        if (!computedItem) {
          this.setBarStyle({ transform: `${transformPosition}(${0}px)`, [barBorderProp]: 0 });
          return;
        }
        const itemPropValue = getComputedStyle(computedItem)[itemProp];
        this.setBarStyle({ transform: `${transformPosition}(${offset}px)`, [barBorderProp]: itemPropValue || 0 });
      }
    }
  }

  setBarStyle(barStyle: Styles) {
    this.barStyle = barStyle;
  }

  receiveProps(newProps: TabBarProps) {
    const { tabPosition, activeId, containerRef } = newProps;
    this.tabPosition = tabPosition;
    this.currentActiveIdRef.current = activeId;
    this.containerRef = containerRef;
    return true;
  }

  render() {
    const { tabPosition, activeId, containerRef } = this.props;
    this.tabPosition = tabPosition;
    this.currentActiveIdRef.current = activeId;
    this.containerRef = containerRef;
    this.computeStyle();
    return (
      <div
        className={classname({
          [`${this.tabsClassPrefix}__bar`]: true,
          [`${classPrefix}-is-${this.tabPosition}`]: true,
        })}
        style={this.barStyle}
      ></div>
    );
  }
}
