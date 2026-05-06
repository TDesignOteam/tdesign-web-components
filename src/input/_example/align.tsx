import 'tdesign-web-components/input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputAlign extends Component {
  render() {
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-input defaultValue="居左对齐" align="left" />
        <t-input defaultValue="居中对齐" align="center" />
        <t-input defaultValue="居右对齐" align="right" />
      </t-space>
    );
  }
}
