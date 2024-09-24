// 临时 input-number
import '../input';

import { Component, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';

export interface InputNumberProps {
  value: number;
  onChange: Function;
}

@tag('t-input-number')
export default class InputNumber extends Component<InputNumberProps> {
  static defaultProps = {
    value: 0,
  };

  static propTypes = {
    value: Number,
    onChange: Function,
  };

  private handleChange = (value) => {
    this.props?.onChange?.(value);
  };

  render(props) {
    return (
      <div className={classname(`${classPrefix}-input-number`, props.className)}>
        <t-input value={props.value} onChange={this.handleChange} />
      </div>
    );
  }
}
