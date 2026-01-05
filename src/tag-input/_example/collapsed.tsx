import 'tdesign-web-components/popup';
import 'tdesign-web-components/space';
import 'tdesign-web-components/tag';
import 'tdesign-web-components/tag-input';

import { Component } from 'omi';

export default class TagInputCollapsed extends Component {
  tags = ['Vue', 'React', 'Miniprogram', 'Angular', 'Flutter'];

  renderCollapsedItems = ({ collapsedSelectedItems: items = [] }: { collapsedSelectedItems?: string[] }) => (
    <t-popup
      showArrow={false}
      destroyOnClose
      content={
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '400px', padding: '4px' }}>
          {items.map((item: string, index: number) => (
            <t-tag key={`${item}-${index}`}>{item}</t-tag>
          ))}
        </div>
      }
    >
      <t-tag>More({items.length})</t-tag>
    </t-popup>
  );

  render() {
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
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
          collapsedItems={this.renderCollapsedItems}
          onChange={(e: CustomEvent) => {
            this.tags = e.detail.value;
            this.update();
          }}
        />
      </t-space>
    );
  }
}
