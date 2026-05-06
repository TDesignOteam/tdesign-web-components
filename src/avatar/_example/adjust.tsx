import 'tdesign-web-components/avatar';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class Avatar extends Component {
  static css = 't-avatar{}';

  render() {
    return (
      <t-space>
        <t-avatar style={{ marginRight: '40px' }}>王</t-avatar>
        <t-avatar style={{ marginRight: '40px' }}>王亿</t-avatar>
        <t-avatar style={{ marginRight: '40px' }}>王亿亿</t-avatar>
      </t-space>
    );
  }
}
