import { Component, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { TdInputGroupProps } from './type';

const classPrefix = getClassPrefix();

export type InputGroupProps = TdInputGroupProps;

@tag('t-input-group')
export default class InputGroup extends Component<InputGroupProps> {
  static propTypes = {
    separate: Boolean,
  };

  static defaultProps = {
    separate: false,
  };

  divRef = createRef();

  render(props: OmiProps<InputGroupProps>) {
    const { separate, children, ...wrapperProps } = props;
    return (
      <div
        ref={this.divRef}
        style={{ width: '100%' }}
        class={classname(`${classPrefix}-input-group`, classname, {
          [`${classPrefix}-input-group--separate`]: !!separate,
        })}
        {...wrapperProps}
      >
        <t-space>{children}</t-space>
      </div>
    );
  }
}
