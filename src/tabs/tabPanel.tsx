import { Component, tag } from 'omi';

import classname from '../_util/classname';
import { StyledProps, TNode } from '../common';
import { TdTabPanelProps } from './type';
import { useTabClass } from './useTabClass';

export interface TabPanelProps extends TdTabPanelProps, StyledProps {
  children?: TNode;
}

@tag('t-tab-panel')
export default class TabPanel extends Component<TabPanelProps> {
  static propsType = {
    children: [Function, Object, String, Number],
    panel: [Function, Object, String, Number],
  };

  static defaultProps = {
    destroyOnHide: true,
    disabled: false,
    draggable: true,
    lazy: false,
    removable: false,
  };

  render() {
    const { tdTabPanelClassPrefix } = useTabClass();
    const { children, innerClass, innerStyle, panel } = this.props;
    return (
      <div className={classname(tdTabPanelClassPrefix, innerClass)} style={innerStyle}>
        {children || panel}
      </div>
    );
  }
}
