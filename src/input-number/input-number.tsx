// 临时 input-number
import '../input';

import { Component, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';

export interface InputNumberProps {
  align?: 'left' | 'center' | 'right';
}

@tag('t-input-number')
export default class InputNumber extends Component {
  render(props) {
    return (
      <div className={classname(`${classPrefix}-input-number`, props.className)}>
        <t-input />
      </div>
    );
  }
}
