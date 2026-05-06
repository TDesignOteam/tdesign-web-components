import 'tdesign-web-components/input-number';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputNumberAlignDemo extends Component {
  render() {
    return (
      <t-space>
        <t-space direction="vertical">
          <t-input-number align="left" defaultValue={100} />
          <t-input-number align="center" defaultValue={200} />
          <t-input-number align="right" defaultValue={300} />
        </t-space>

        <t-space direction="vertical">
          <t-input-number align="left" theme="normal" defaultValue={100} />
          <t-input-number align="center" theme="normal" defaultValue={200} />
          <t-input-number align="right" theme="normal" defaultValue={300} />
        </t-space>
      </t-space>
    );
  }
}
