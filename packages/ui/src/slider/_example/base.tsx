import 'tdesign-web-components/slider';
import 'tdesign-web-components/space';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  value1 = signal(12);

  value2 = signal([30, 70]);

  @bind
  onChange(value) {
    console.log('[change]', value);
  }

  @bind
  onChangeEnd(value) {
    console.log('[changeEnd]', value);
  }

  render() {
    return (
      <t-space direction="vertical" size="60px" style={{ width: '100%' }} innerStyle={{ width: '100%' }}>
        <t-slider value={this.value1.value} onChange={this.onChange} onChangeEnd={this.onChangeEnd} />
        <t-slider range value={this.value2.value} onChange={this.onChange} onChangeEnd={this.onChangeEnd} />
      </t-space>
    );
  }
}
