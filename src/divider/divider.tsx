import { classNames, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { type StyledProps } from '../common';
import { type TdDividerProps } from './type';

export interface DividerProps extends TdDividerProps, StyledProps {}

@tag('t-divider')
export default class Divider extends Component<DividerProps> {
  static css = [];

  static defaultProps = {
    align: 'center',
    dashed: false,
    layout: 'horizontal',
  };

  static propTypes = {
    align: String,
    content: Object,
    dashed: Boolean,
    layout: String,
  };

  componentName = `${getClassPrefix()}-divider`;

  render(props: OmiProps<DividerProps>) {
    const childNode = props.content || props.children;

    const showText = props.layout !== 'vertical' && !!childNode;
    const dividerClassNames = classNames(
      `${this.componentName}`,
      {
        [`${this.componentName}--${props.layout}`]: props.layout,
        [`${this.componentName}--dashed`]: !!props.dashed,
        [`${this.componentName}--with-text`]: showText,
        [`${this.componentName}--with-text-${props.align}`]: showText,
      },
      props.innerClass,
    );
    return (
      <div class={dividerClassNames} style={props.innerStyle}>
        {showText ? <span class={`${this.componentName}__inner-text`}>{childNode}</span> : null}
      </div>
    );
  }
}
