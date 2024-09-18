// import './list-item-meta'
import '../loading/loading';

import { classNames, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { ListItemProps } from './types';

const ListItemClassNamePefix = (className: string) => `${getClassPrefix()}-list-item${className}`;

@tag('t-list-item')
export default class ListItem extends Component<ListItemProps> {
  static css = [];

  static isLightDOM = true;

  static defaultProps = {};

  handleClick(e: MouseEvent) {
    console.log(e);
  }

  render(props: OmiProps<ListItemProps>) {
    const { action, content, children } = props;

    const actionElement = action && <ul class={classNames(ListItemClassNamePefix(`__action`))}>{action}</ul>;

    return (
      <li class={classNames(ListItemClassNamePefix(''))} onClick={this.handleClick}>
        <div class={classNames(ListItemClassNamePefix('-main'))}>
          {content || children}
          {action && actionElement}
        </div>
      </li>
    );
  }
}
