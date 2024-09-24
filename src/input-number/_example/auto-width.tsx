import 'tdesign-web-components/input-number';

import { Component } from 'omi';

export default class InputNumberAutoWidthDemo extends Component {
  render() {
    return <t-input-number autoWidth min={-5} defaultValue={1} />;
  }
}
