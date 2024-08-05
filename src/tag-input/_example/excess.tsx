import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputExcess extends Component {
  tags1 = ['Vue', 'React', 'Omi'];

  render() {
    const onChange = (val, context) => {
      this.tags1 = val;
      this.update();
      console.log(val, context);
    };

    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        <t-tag-input
          value={this.tags1}
          onChange={onChange}
          clearable
          excessTagsDisplayType="scroll"
          placeholder="请输入"
        />
        <t-tag-input
          value={this.tags1}
          onChange={onChange}
          clearable
          excessTagsDisplayType="break-line"
          placeholder="请输入"
        />
      </t-space>
    );
  }
}
