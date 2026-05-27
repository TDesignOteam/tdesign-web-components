import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputSize extends Component {
  tags1 = ['Vue', 'React'];

  tags2 = ['Vue', 'React'];

  tags3 = ['Vue', 'React'];

  render() {
    return (
      <t-space direction="vertical">
        <t-tag-input
          value={this.tags1}
          size="small"
          style={{ width: '300px' }}
          clearable
          onChange={(e: CustomEvent) => {
            this.tags1 = e.detail.value;
            this.update();
          }}
        />

        <t-tag-input
          value={this.tags2}
          clearable
          onChange={(e: CustomEvent) => {
            this.tags2 = e.detail.value;
            this.update();
          }}
        />

        <t-tag-input
          value={this.tags3}
          size="large"
          clearable
          onChange={(e: CustomEvent) => {
            this.tags3 = e.detail.value;
            this.update();
          }}
        />
      </t-space>
    );
  }
}
