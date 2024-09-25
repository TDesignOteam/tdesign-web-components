import 'tdesign-web-components/input-number';

import { Component } from 'omi';

export default class InputNumberLeftDemo extends Component {
  render() {
    return <t-input-number defaultValue={5} theme="column" onChange={(v) => console.log(v)} />;
  }
}
