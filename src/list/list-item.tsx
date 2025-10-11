// import './list-item-meta'
import '../loading/loading';

import { Component, OmiProps, tag } from 'omi';

import classnames, { getClassPrefix } from '../_util/classname';
import { ListItemProps } from './types';

const ListItemClassNamePrefix = (className: string) => `${getClassPrefix()}-list-item${className}`;

@tag('t-list-item')
export default class ListItem extends Component<ListItemProps> {
  static css = [];

  static propTypes = {
    action: [String, Object, Function, Number],
    content: [String, Object, Function, Number],
    onClick: Function,
  };

  static isLightDOM = true;

  static defaultProps = {};

  render(props: OmiProps<ListItemProps>) {
    const { action, content, children, innerClass, innerStyle } = props;

    const actionElement = action && <ul class={classnames(ListItemClassNamePrefix(`__action`))}>{action}</ul>;

    return (
      <li class={classnames(ListItemClassNamePrefix(''), innerClass)} style={innerStyle}>
        <div class={classnames(ListItemClassNamePrefix('-main'))}>
          {content || children}
          {action && actionElement}
        </div>
      </li>
    );
  }
}
