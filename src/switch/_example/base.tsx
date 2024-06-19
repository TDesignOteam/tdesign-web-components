import 'tdesign-web-components/switch';

import { Component, signal } from 'omi';

export default class Switch extends Component {
  checked = signal(false);

  onChange = (value) => {
    console.log('value', value);
    this.checked.value = value;
    this.update();
  };

  render() {
    return (
      <div style={{ gap: 16, display: 'inline-flex' }}>
        <t-switch size="large" />
        <t-switch size="large" value={this.checked.value} onChange={this.onChange} />
      </div>
    );
  }
}
