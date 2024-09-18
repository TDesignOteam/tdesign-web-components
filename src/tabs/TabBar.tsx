import { Component, createRef, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
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

  barStyle: Styles = {};

  tabsClassPrefix = `${getClassPrefix()}-tabs`;

  containerRef = createRef<HTMLDivElement>();

  computeStyle() {
    const isHorizontal = ['bottom', 'top'].includes(this.props.tabPosition);
    const transformPosition = isHorizontal ? 'translateX' : 'translateY';
    const itemProp = isHorizontal ? 'width' : 'height';
    const barBorderProp = isHorizontal ? 'width' : 'height';

    let offset = 0;

    if (this.containerRef.current) {
      const itemsRef = this.containerRef.current.querySelectorAll<HTMLElement>('t-tab-nav-item');
      if (itemsRef.length - 1 >= (this.currentActiveIdRef.current as number)) {
        itemsRef.forEach((item, itemIndex) => {
          if (itemIndex < (this.currentActiveIdRef.current as number)) {
            offset += Number(getComputedStyle(item)[itemProp].replace('px', ''));
          }
        });
        const computedItem = itemsRef[this.currentActiveIdRef.current];
        if (!computedItem) {
          this.barStyle = { transform: `${transformPosition}(${0}px)`, [barBorderProp]: 0 };
          return;
        }
        const itemPropValue = getComputedStyle(computedItem)[itemProp];
        this.barStyle = { transform: `${transformPosition}(${offset}px)`, [barBorderProp]: itemPropValue || 0 };
      }
    }
  }

  install(): void {
    const { activeId, containerRef } = this.props;
    this.currentActiveIdRef.current = activeId;
    this.containerRef = containerRef;
  }

  installed(): void {
    setTimeout(() => {
      this.computeStyle();
      this.update();
    }, 0);
  }

  render() {
    const { tabPosition, activeId, containerRef } = this.props;
    this.currentActiveIdRef.current = activeId;
    this.containerRef = containerRef;
    this.computeStyle();

    return (
      <div
        className={classname({
          [`${this.tabsClassPrefix}__bar`]: true,
          [`${getClassPrefix()}-is-${tabPosition}`]: true,
        })}
        style={this.barStyle}
      ></div>
    );
  }
}
