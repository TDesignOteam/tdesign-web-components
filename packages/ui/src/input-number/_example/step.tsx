import 'tdesign-web-components/input-number';

import { Component, signal } from 'omi';

export default class InputNumberStepDemo extends Component {
  value = signal(3.2);

  render() {
    return (
      <t-input-number
        value={this.value.value}
        onChange={(value) => {
          this.value.value = value;
        }}
        max={15}
        min={-5}
        step={1.2}
        decimalPlaces={2}
      />
    );
  }
}
