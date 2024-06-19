import { Component, tag } from 'omi';

import { StyledProps } from '../common';
import { TdRangeInputProps } from './type';

export interface RangeInputProps extends TdRangeInputProps, StyledProps {}

@tag('t-range-input')
export default class RangeInput extends Component<RangeInputProps> {
  static css = [];

  constructor() {
    super();
    this.props = {};
  }

  static defaultProps = {};

  render() {
    return <div>RangeInput</div>;
  }
}
