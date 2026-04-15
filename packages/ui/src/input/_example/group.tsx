import 'tdesign-web-components/input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputGroup extends Component {
  render() {
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-input-group separate>
          <t-input defaultValue="0731" style={{ width: 100 }} />
          <t-input defaultValue="12345677" />
        </t-input-group>
        <t-input-group separate style={{ width: '100%' }}>
          <t-input />
          <t-input />
        </t-input-group>
        <t-input-group separate>
          <t-input style={{ width: 100 }} defaultValue="0731" />
          <span style={{ lineHeight: '32px' }}>&nbsp;-&nbsp;</span>
          <t-input style={{ width: 100 }} defaultValue="12345" />
          <t-input style={{ width: 100 }} defaultValue="678901" />
          <t-input style={{ width: 100 }} />
        </t-input-group>
      </t-space>
    );
  }
}
