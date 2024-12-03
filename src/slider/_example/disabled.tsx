import 'tdesign-web-components/slider';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class Demo extends Component {
  value1 = signal(12);

  value2 = signal([30, 70]);

  render() {
    return (
      <t-space direction="vertical" size="60px" style={{ width: '100%' }} innerStyle={{ width: '100%' }}>
        <t-slider value={this.value1.value} disabled />
        <t-slider range value={this.value2.value} disabled />
      </t-space>
    );
  }
}
