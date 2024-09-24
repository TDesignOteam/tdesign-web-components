import './TabNav';
import './tabPanel';

import { toArray } from 'lodash';
import { Component, tag, VNode } from 'omi';

import classname from '../_util/classname';
import UseDragSorter from '../_util/useDragSorter';
import { StyledProps, TNode } from '../common';
import { TabValue, TdTabsProps } from './type';
import { useTabClass } from './useTabClass';

export interface TabsProps extends TdTabsProps, StyledProps {
  children?: TNode;
  ref: Partial<Record<'current', TabsProps>>;
}

@tag('t-tabs')
export default class Tabs extends Component<TabsProps> {
  static defaultProps = {
    addable: false,
    disabled: false,
    dragSort: false,
    placement: 'top',
    scrollPosition: 'auto',
    size: 'medium',
    theme: 'normal',
  };

  static propsType = {
    children: [Function, Object, String, Number],
    list: [Function, Object, String, Number],
    placement: String,
    theme: String,
    size: String,
    defaultValue: [String, Number],
    onChange: Function,
  };

  tabClasses = useTabClass();

  targetClassNameRegExpStr = `^${this.tabClasses.tdTabsClassPrefix}(__nav-item|__nav-item-wrapper|__nav-item-text-wrapper)`;

  dragSorter: UseDragSorter<TabValue> | null = null;

  memoChildren = () => {
    const { list, children } = this.props;
    if (!list || list.length === 0) {
      return children;
    }
    return list.map((panelProps) => <t-tab-panel key={panelProps.value} {...panelProps} />);
  };

  itemList = () =>
    toArray(this.memoChildren())
      .map((child: VNode) => {
        if (child && child.nodeName === 't-tab-panel') {
          return child.attributes;
        }
        return null;
      })
      .filter(Boolean);

  value: TabValue = '';

  receiveProps(newProps: TabsProps) {
    if (newProps.value !== undefined) {
      this.value = newProps.value;
    }
    return true;
  }

  handleChange = (v: TabValue) => {
    if (this.props.value === undefined) {
      this.value = v;
      this.update();
    }
    this.props.onChange?.(v);
  };

  handleClickTab = (v: TabValue) => {
    if (this.props.value === undefined) {
      this.value = v;
      this.update();
    }
  };

  get headerNode() {
    return (
      <div
        className={classname(
          this.tabClasses.tdTabsClassGenerator('header'),
          this.tabClasses.tdClassGenerator(`is-${this.props.placement}`),
        )}
      >
        <t-tab-nav
          {...this.props}
          getDragProps={this.dragSorter?.getDragProps}
          activeValue={this.value}
          onRemove={this.props.onRemove}
          itemList={this.itemList()}
          tabClick={this.handleClickTab}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  install() {
    this.value =
      this.props.defaultValue === undefined && Array.isArray(this.itemList) && this.itemList.length !== 0
        ? this.itemList[0].value
        : this.props.defaultValue;

    this.dragSorter = new UseDragSorter({
      ...this.props,
      sortOnDraggable: this.props.dragSort,
      onDragOverCheck: {
        x: true,
        targetClassNameRegExp: new RegExp(this.targetClassNameRegExpStr),
      },
    });
  }

  render(props: TabsProps) {
    const { className, style } = props;

    return (
      <div ref={this.props.ref} className={classname(this.tabClasses.tdTabsClassPrefix, className)} style={style}>
        {this.props.placement !== 'bottom' ? this.headerNode : null}
        <div
          className={classname(
            this.tabClasses.tdTabsClassGenerator('content'),
            this.tabClasses.tdClassGenerator(`is-${this.props.placement}`),
          )}
        >
          {toArray(this.memoChildren()).map((child: any) => {
            if (child && child.nodeName === 't-tab-panel') {
              if (child.attributes.value === this.value) {
                return child;
              }
              if (child.attributes.destroyOnHide === false) {
                return <t-tab-panel {...child.attributes} style={{ display: 'none' }}></t-tab-panel>;
              }
            }
            return null;
          })}
        </div>
        {this.props.placement === 'bottom' ? this.headerNode : null}
      </div>
    );
  }
}
