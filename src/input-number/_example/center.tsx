import 'tdesign-web-components/input-number';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class InputNumberCenterDemo extends Component {
  value1 = signal('');

  value2 = signal(100);

  decimalValue = signal(3.41);

  error = signal(undefined);

  get tips() {
    if (this.error.value === 'exceed-maximum') {
      return 'number can not be exceed maximum';
    }
    if (this.error.value === 'below-minimum') {
      return 'number can not be below minimum';
    }
    return undefined;
  }

  render() {
    return (
      <t-space direction="vertical">
        <t-input-number
          value={this.decimalValue.value}
          onChange={(value) => {
            this.decimalValue.value = value;
          }}
          max={5}
          autoWidth
        />

        <t-input-number
          value={this.value1.value}
          onChange={(value) => {
            console.log('onchange', value);
            this.value1.value = value;
          }}
          step={0.18}
          max={5}
          allowInputOverLimit={false}
          style={{ width: 250 }}
        />

        <t-input-number
          value={this.value2.value}
          onChange={(value, ctx) => {
            this.value2.value = value;
            console.info('change', value, ctx);
          }}
          max={15}
          min={-2}
          inputProps={{ tips: this.tips }}
          suffix="个"
          style={{ width: 300 }}
          onValidate={({ error }) => {
            this.error.value = error;
          }}
          onBlur={(v, ctx) => {
            console.log('blur', v, ctx);
          }}
          onFocus={(v, ctx) => {
            console.log('focus', v, ctx);
          }}
          onEnter={(v, ctx) => {
            console.log('enter', v, ctx);
          }}
          onKeydown={(v, ctx) => {
            console.info('keydown', v, ctx);
          }}
          onKeyup={(v, ctx) => {
            console.info('keyup', v, ctx);
          }}
          onKeypress={(v, ctx) => {
            console.info('keypress', v, ctx);
          }}
        />
      </t-space>
    );
  }
}
