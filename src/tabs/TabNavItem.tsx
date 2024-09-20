import 'tdesign-icons-web-components/esm/components/close';

import { Component, createRef, tag } from 'omi';

import classname from '../_util/classname';
import noop from '../_util/noop';
import { StyledProps } from '../common';
import { DragSortInnerProps } from '../hooks/useDragSorter';
import type { TdTabPanelProps, TdTabsProps } from './type';
import { useTabClass } from './useTabClass';

export interface TabNavItemProps extends TdTabPanelProps, StyledProps {
  // 当前 item 是否处于激活态
  isActive: boolean;
  // 点击事件
  onClick: (e: MouseEvent) => void;
  theme: 'normal' | 'card';
  placement: string;
  size?: 'medium' | 'large';
  index: number;
  innerRef(ref: HTMLElement): void;
  onTabRemove: TdTabsProps['onRemove'];
  dragProps?: DragSortInnerProps;
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
  installed() {
    this.props.innerRef(this.containerRef.current);
  }

  // 渲染组件
  render() {
    const {
      dragProps,
      value,
      label,
      index,
      isActive,
      placement,
      size,
      theme,
      disabled,
      removable,
      onRemove,
      onTabRemove,
    } = this.props;
    const isCard = theme === 'card';
    const { tdTabsClassGenerator, tdClassGenerator, tdSizeClassGenerator } = useTabClass();
    return (
      <div
        {...dragProps}
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
        {/* 根据新的 dom 结构和样式进行改动，卡片类型情况下不需要 nav-item-wrapper 这个 div */}
        {isCard ? (
          <span className={classname(tdTabsClassGenerator('nav-item-text-wrapper'))}>{label}</span>
        ) : (
          <div ref={this.navItemDom} className={classname(tdTabsClassGenerator('nav-item-wrapper'))}>
            <span className={classname(tdTabsClassGenerator('nav-item-text-wrapper'))}>{label}</span>
          </div>
        )}
        {removable ? (
          <t-icon-close
            cls={classname('remove-btn')}
            onClick={(e) => {
              if (disabled) {
                return;
              }
              e.stopPropagation();
              onRemove({ value, e });
              onTabRemove({ value, e, index });
            }}
          />
        ) : null}
      </div>
    );
  }
}
