import 'tdesign-web-components/badge';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class Badge extends Component {
  static css = `t-badge { margin-right: 24px; }`;

  render() {
    return (
      <>
        <h3 style={{ marginBottom: 16 }}>1.默认大小</h3>
        <t-badge count={2}>
          <t-button>按钮</t-button>
        </t-badge>
        <t-badge count={99}>
          <t-button>按钮</t-button>
        </t-badge>
        <t-badge count={999}>
          <t-button>按钮</t-button>
        </t-badge>
        <h3 style={{ marginBottom: 16, marginTop: 32 }}>2.小</h3>
        <t-badge count={2} size="small">
          <t-button>按钮</t-button>
        </t-badge>
        <t-badge count={99} size="small">
          <t-button>按钮</t-button>
        </t-badge>
        <t-badge count={999} size="small">
          <t-button>按钮</t-button>
        </t-badge>
      </>
    );
  }
}
