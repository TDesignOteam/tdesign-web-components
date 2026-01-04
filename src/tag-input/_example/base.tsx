import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputBase extends Component {
  tags1 = ['Vue', 'React', 'Omi'];

  tags2 = ['Vue', 'React'];

  tags3 = ['Vue', 'React'];

  render() {
    const onChange = (e: CustomEvent) => {
      this.tags1 = e.detail.value;
      this.update();
      console.log('change', e.detail.value);
    };

    return (
      <t-space direction="vertical">
        <t-tag-input value={this.tags1} onChange={onChange} clearable placeholder="请输入" />
        <t-tag-input value={this.tags2} label="Controlled:" />
        <t-tag-input defaultValue={this.tags2} label="UnControlled:" />
      </t-space>
    );
  }
}
