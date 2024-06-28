import 'tdesign-web-components/avatar';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class AvatarShape extends Component {
  render() {
    return (
      <t-space>
        <t-avatar style={{ marginRight: '40px' }}>W</t-avatar>
        <t-avatar shape="round" style={{ marginRight: '40px' }}>
          W
        </t-avatar>
      </t-space>
    );
  }
}
