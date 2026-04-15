import 'tdesign-web-components/badge';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components/esm/components/user';

import { Component } from 'omi';

export default class Badge extends Component {
  static css = `t-badge { margin-right: 24px; }`;

  render() {
    return (
      <>
        <t-badge dot count={1}>
          <t-button size="large"></t-button>
        </t-badge>
        <t-badge dot count={1}>
          解锁新徽章
        </t-badge>
        <t-badge dot count={1}>
          <t-icon-user size={24} />
        </t-badge>
      </>
    );
  }
}
