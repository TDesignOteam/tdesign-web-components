import 'tdesign-web-components/slider';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class Demo extends Component {
  value1 = signal(12);

  marks1 = signal({
    0: '0°C',
    20: '20°C',
    40: '40°C',
    60: '60°C',
    80: <span style="color: #0052d9">80°C</span>,
    100: <span style="color: #0052d9">100°C</span>,
  });

  value2 = signal([30, 70]);

  marks2 = signal({
    0: '0°C',
    20: '20°C',
    40: '40°C',
    60: '60°C',
    80: <span style="color: #0052d9">80°C</span>,
    100: '100°C',
  });

  render() {
    return (
      <t-space size="60px" style={{ height: '300px' }}>
        <t-slider value={this.value1.value} marks={this.marks1.value} layout="vertical" />
        <t-slider range value={this.value2.value} marks={this.marks2.value} layout="vertical" />
      </t-space>
    );
  }
}
