import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/tag';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputCustomTag extends Component {
  tags = ['StudentA', 'StudentB', 'StudentC'];

  // 方式一：使用 tag 定义标签内部内容
  renderTag = (value: string) => (
    <span>
      <img
        src="https://tdesign.gtimg.com/site/avatar.jpg"
        style={{ maxWidth: '18px', maxHeight: '18px', borderRadius: '50%', verticalAlign: 'text-top' }}
      />
      {value}
    </span>
  );

  // 方式二：使用 valueDisplay 定义全部内容
  renderValueDisplay = (value: string[], onClose: (index: number) => void) =>
    value.map((item, index) => (
      <t-tag
        key={item}
        closable
        style={{ marginRight: '4px' }}
        onClose={() => {
          onClose(index);
        }}
      >
        <div>
          <img
            src="https://tdesign.gtimg.com/site/avatar.jpg"
            style={{ maxWidth: '18px', maxHeight: '18px', borderRadius: '50%', verticalAlign: 'text-top' }}
          />
          {item}
        </div>
      </t-tag>
    ));

  render() {
    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        {/* 方式一：使用 tag 定义标签内部内容 */}
        <t-tag-input
          value={this.tags}
          clearable
          minCollapsedNum={2}
          tag={this.renderTag}
          onChange={(e: CustomEvent) => {
            this.tags = e.detail.value;
            this.update();
          }}
        />

        <br />
        <br />

        {/* 方式二：使用 valueDisplay 定义全部内容 */}
        <t-tag-input
          value={this.tags}
          valueDisplay={this.renderValueDisplay}
          clearable
          onChange={(e: CustomEvent) => {
            this.tags = e.detail.value;
            this.update();
          }}
        />
      </t-space>
    );
  }
}
