import '@tdesign/web-components-ui/slider';
import '@tdesign/web-components-ui/space';

import { Component, signal } from 'omi';

export default class Demo extends Component {
  value1 = signal(12);

  value2 = signal([30, 70]);

  render() {
    return (
      <t-space size="60px" style={{ height: '300px', display: 'inline-flex' }}>
        <t-slider value={this.value1.value} layout="vertical" />
        <t-slider range value={this.value2.value} layout="vertical" />
      </t-space>
    );
  }
}
