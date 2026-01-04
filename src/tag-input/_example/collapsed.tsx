import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputCollapsed extends Component {
  tags = ['Vue', 'React', 'Miniprogram', 'Angular', 'Flutter'];

  render() {
    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        <t-tag-input
          value={this.tags}
          minCollapsedNum={1}
          onChange={(e: CustomEvent) => {
            this.tags = e.detail.value;
            this.update();
          }}
        />
        <t-tag-input
          value={this.tags}
          minCollapsedNum={3}
          onChange={(e: CustomEvent) => {
            this.tags = e.detail.value;
            this.update();
          }}
        />
      </t-space>
    );
  }
}
