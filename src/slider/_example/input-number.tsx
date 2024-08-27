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
      <t-space direction="vertical" size="60px" style={{ width: '100%' }}>
        <t-slider value={this.value1.value} inputNumberProps={inputNumberProps} />
        <t-slider range value={this.value2.value} inputNumberProps={inputNumberProps} />
      </t-space>
    );
  }
}
