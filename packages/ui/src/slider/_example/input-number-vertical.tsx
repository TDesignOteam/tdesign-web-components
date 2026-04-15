import 'tdesign-web-components/slider';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class Demo extends Component {
  value1 = signal(12);

  value2 = signal([30, 70]);

  render() {
    const inputNumberProps = {
      theme: 'column',
      autoWidth: true,
    };

    return (
      <t-space size="60px" style={{ height: '300px', display: 'inline-flex' }}>
        <t-slider value={this.value1.value} layout="vertical" inputNumberProps={inputNumberProps} />
        <t-slider range value={this.value2.value} layout="vertical" inputNumberProps={inputNumberProps} />
      </t-space>
    );
  }
}
