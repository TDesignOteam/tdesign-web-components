import 'tdesign-web-components/input-number';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputNumberCenterDemo extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-input-number
          defaultValue={'19999999999999999'}
          largeNumber
          decimalPlaces={2}
          step={1}
          style={{ width: '350px' }}
        />

        <t-input-number defaultValue={'0.8975527383412673418'} largeNumber step={0.888} style={{ width: '350px' }} />
      </t-space>
    );
  }
}
