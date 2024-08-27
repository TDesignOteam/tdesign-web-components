import 'tdesign-web-components/badge';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class Badge extends Component {
  static css = `t-badge { margin-right: 24px; }`;

  render() {
    return (
      <>
        <t-badge count={2}>
          <t-button size="large"></t-button>
        </t-badge>
        <t-badge count={99}>
          <t-button size="large"></t-button>
        </t-badge>
        <t-badge count={100}>
          <t-button size="large"></t-button>
        </t-badge>
      </>
    );
  }
}
