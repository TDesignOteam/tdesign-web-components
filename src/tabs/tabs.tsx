import { toArray } from 'lodash';
import { Component, createRef, tag, VNode } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import TabNav from './TabNav';
import TabPanel from './tabPanel';
import { TabValue, TdTabsProps } from './type';

export interface TabsProps extends TdTabsProps, StyledProps {}

@tag('t-tabs')
export default class Tabs extends Component<TabsProps> {
  static defaultProps = {
    placement: 'top',
    size: 'medium',
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

  ref = createRef();

  memoChildren = () => {
    const { list, children } = this.props;
    if (!list || list.length === 0) {
      return children;
    }
    return list.map((panelProps) => <TabPanel key={panelProps.value} {...panelProps} />);
  };

  itemList = () =>
    toArray(this.memoChildren())
      .map((child: VNode) => {
        console.log(child);
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

  headerNode = () => (
    <div className={classname(`${getClassPrefix()}-tabs__header`, `${getClassPrefix()}-is-${this.props.placement}`)}>
      <TabNav
        {...this.props}
        activeValue={this.value}
        itemList={this.itemList()}
        tabClick={this.handleClickTab}
        onChange={this.handleChange}
      />
    </div>
  );

  install() {
    this.value =
      this.props.defaultValue === undefined && Array.isArray(this.itemList) && this.itemList.length !== 0
        ? this.itemList[0].value
        : this.props.defaultValue;
  }

  render(props: TabsProps) {
    const { className, style } = props;
    return (
      <div ref={this.ref} className={classname(`${getClassPrefix()}-tabs`, className)} style={style}>
        {this.props.placement !== 'bottom' ? this.headerNode() : null}
        <div
          className={classname(`${getClassPrefix()}-tabs__content`, `${getClassPrefix()}-is-${this.props.placement}`)}
        >
          {toArray(this.memoChildren()).map((child: any) => {
            if (child && child.nodeName === 't-tab-panel') {
              if (child.attributes.value === this.value) {
                return child;
              }
              if (child.attributes.destroyOnHide === false) {
                return <TabPanel {...child.attributes} style={{ display: 'none' }}></TabPanel>;
              }
            }
            return null;
          })}
        </div>
        {this.props.placement === 'bottom' ? this.headerNode() : null}
      </div>
    );
  }
}
