import 'tdesign-web-components/input-number';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class InputNumberFormatDemo extends Component {
  value = signal(0);

  value1 = signal(0);

  render() {
    return (
      <t-space direction="vertical">
        <t-input-number
          value={this.value.value}
          onChange={(value) => {
            this.value.value = value;
          }}
          max={15}
          min={-12}
          step={1.2}
          format={(value) => `${value} %`}
          style={{ width: 250 }}
        />

        <t-input-number
          decimalPlaces={2}
          format={(_, { fixedNumber }) => `${fixedNumber} %`}
          value={this.value1.value}
          onChange={(value) => {
            this.value1.value = value;
          }}
          style={{ width: 250 }}
        />
      </t-space>
    );
  }
}
