import 'tdesign-web-components/radio';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class BasicExample extends Component {
  render() {
    return (
      <t-space>
        <t-radio checked={false}>未选中</t-radio>
        <t-radio allowUncheck={true}>取消选中</t-radio>
        <t-radio checked>已选中</t-radio>
        <t-radio checked={false} disabled>
          禁用未选中
        </t-radio>
        <t-radio checked={true} disabled>
          禁用已选中
        </t-radio>
      </t-space>
    );
  }
}
