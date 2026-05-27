import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputExcess extends Component {
  tags1 = ['Vue', 'React', 'Omi'];

  tags2 = ['Vue', 'React', 'Omi'];

  render() {
    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        Scroll:
        <t-tag-input
          value={this.tags1}
          excessTagsDisplayType="scroll"
          placeholder="请输入"
          style={{ width: '300px' }}
          clearable
          onChange={(e: CustomEvent) => {
            this.tags1 = e.detail.value;
            this.update();
            console.log('onChange', e.detail.value);
          }}
        />
        BreakLine:
        <t-tag-input
          value={this.tags2}
          placeholder="请输入"
          excessTagsDisplayType="break-line"
          style={{ width: '300px' }}
          clearable
          onChange={(e: CustomEvent) => {
            this.tags2 = e.detail.value;
            this.update();
            console.log('onChange', e.detail.value);
          }}
        />
      </t-space>
    );
  }
}
