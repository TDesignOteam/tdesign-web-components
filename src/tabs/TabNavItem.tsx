import { Component, createRef, tag } from 'omi';

import classname from '../_util/classname';
import noop from '../_util/noop';
import { StyledProps } from '../common';
import type { TdTabPanelProps } from './type';
import { useTabClass } from './useTabClass';

export interface TabNavItemProps extends TdTabPanelProps, StyledProps {
  isActive: boolean;
  onClick: (e: MouseEvent) => void;
  placement: string;
  theme: 'normal' | 'card';
  size?: 'medium' | 'large';
  innerRef(ref: HTMLElement): void;
}

@tag('t-tab-nav-item')
export default class TabNavItem extends Component<TabNavItemProps> {
  static defaultProps = {
    theme: 'normal',
    placement: 'top',
    size: 'medium',
    disabled: false,
  };

  static propsType = {
    isActive: Boolean,
    onClick: Function,
    size: String,
    theme: String,
    onChange: Function,
  };

  containerRef = createRef<HTMLDivElement>();

  navItemDom = createRef<HTMLDivElement>();

  // 在组件挂载后设置引用
  componentDidMount() {
    this.props.innerRef(this.containerRef.current);
  }

  // 渲染组件
  render() {
    const { label, isActive, placement, size, theme, disabled } = this.props;
    const isCard = theme === 'card';
    const { tdTabsClassGenerator, tdClassGenerator, tdSizeClassGenerator } = useTabClass(); // 假设 useTabClass 已经定义好
    return (
      <div
        ref={this.containerRef}
        onClick={disabled ? noop : this.props.onClick}
        className={classname(
          tdTabsClassGenerator('nav-item'),
          tdSizeClassGenerator(size),
          isCard ? tdTabsClassGenerator('nav--card') : '',
          isActive ? tdClassGenerator('is-active') : '',
          tdClassGenerator(`is-${placement}`),
          disabled ? tdClassGenerator('is-disabled') : '',
          this.props.className,
        )}
      >
        {isCard ? (
          <span className={classname(tdTabsClassGenerator('nav-item-text-wrapper'))}>{label}</span>
        ) : (
          <div ref={this.navItemDom} className={classname(tdTabsClassGenerator('nav-item-wrapper'))}>
            <span className={classname(tdTabsClassGenerator('nav-item-text-wrapper'))}>{label}</span>
          </div>
        )}
      </div>
    );
  }
}
