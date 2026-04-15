import 'tdesign-web-components/badge';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class Badge extends Component {
  static css = `t-badge { margin-right: 24px; }`;

  render() {
    return (
      <>
        <t-badge shape={'circle'} count={2}>
          <t-button> circle</t-button>
        </t-badge>
        <t-badge shape={'round'} count={99}>
          <t-button>round</t-button>
        </t-badge>
      </>
    );
  }
}
