import 'tdesign-web-components/input-number';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputNumberSizeDemo extends Component {
  render() {
    return (
      <t-space>
        <t-space direction="vertical">
          <t-input-number size="small" max={15} min={-12} defaultValue={3} />
          <t-input-number max={15} min={-12} defaultValue={6} />
          <t-input-number size="large" max={15} min={-12} defaultValue={9} />
        </t-space>

        <t-space direction="vertical">
          <t-input-number defaultValue={5} size="small" theme="column" onChange={console.log} />
          <t-input-number defaultValue={5} theme="column" onChange={console.log} />
          <t-input-number defaultValue={10} size="large" theme="column" onChange={console.log} />
        </t-space>

        <t-space direction="vertical">
          <t-input-number defaultValue={5} size="small" theme="normal" onChange={console.log} />
          <t-input-number defaultValue={5} theme="normal" onChange={console.log} />
          <t-input-number defaultValue={10} size="large" theme="normal" onChange={console.log} />
        </t-space>
      </t-space>
    );
  }
}
