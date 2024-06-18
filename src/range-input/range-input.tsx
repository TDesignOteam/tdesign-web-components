import { Component, tag } from 'omi';

export type RangeInputProps = {};

@tag('t-range-input')
export default class Button extends Component<RangeInputProps> {
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
