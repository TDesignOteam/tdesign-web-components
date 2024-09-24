import 'tdesign-web-components/input-number';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputNumberNormalDemo extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-input-number defaultValue={10} onChange={console.log} theme="normal" max={15} min={-2} />

        <t-input-number theme="normal" align="right" label="机器：" suffix="台" />

        <t-input-number
          theme="normal"
          align="right"
          defaultValue={10}
          onChange={console.log}
          label={<span>金额：</span>}
          suffix={<span>元</span>}
        />
      </t-space>
    );
  }
}
