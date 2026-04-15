import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-web-components/badge';

import { Component } from 'omi';

export default class Badge extends Component {
  static css = `t-badge { margin-right: 24px; }`;

  render() {
    return (
      <>
        <t-badge count={2}>
          <t-button>默认</t-button>
        </t-badge>
        <t-badge count={2} offset={[10, 10]}>
          <t-button>[10,10]</t-button>
        </t-badge>
        <t-badge count={2} offset={[-10, 10]}>
          <t-button>[-10,10]</t-button>
        </t-badge>
        <t-badge count={2} offset={[-10, -10]}>
          <t-button>[-10,-10]</t-button>
        </t-badge>
        <t-badge count={2} offset={[10, -10]}>
          <t-button>[10,-10]</t-button>
        </t-badge>
      </>
    );
  }
}
