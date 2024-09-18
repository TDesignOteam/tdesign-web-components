import { Component, tag } from 'omi';

import classname from '../_util/classname';
import { StyledProps } from '../common';
import { TdTabPanelProps } from './type';
import { useTabClass } from './useTabClass';

export interface TabPanelProps extends TdTabPanelProps, StyledProps {}

@tag('t-tab-panel')
export default class TabPanel extends Component<TabPanelProps> {
  static propsType = {
    children: [Function, Object, String, Number],
    panel: [Function, Object, String, Number],
  };

  render() {
    const { tdTabPanelClassPrefix } = useTabClass();
    const { children, className, style, panel } = this.props;
    return (
      <div className={classname(tdTabPanelClassPrefix, className)} style={style}>
        {children || panel}
      </div>
    );
  }
}
