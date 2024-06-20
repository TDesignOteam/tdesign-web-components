import 'tdesign-web-components/switch';
import 'tdesign-web-components/space';

import { bind, Component, signal } from 'omi';

export default class Switch extends Component {
  checked = signal(true);

  @bind
  onChange(value) {
    console.log('value', value);
    this.checked.value = value;
    this.update();
  }

  render() {
    return (
      <t-space>
        <t-switch size="large" />
        <t-switch size="large" value={this.checked.value} onChange={this.onChange} />
      </t-space>
    );
  }
}
