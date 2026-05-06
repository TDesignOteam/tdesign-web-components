import 'tdesign-web-components/tag-input';

import { Component } from 'omi';
import { MessagePlugin } from 'tdesign-web-components/message';

export default class TagInputLimit extends Component {
  tags = [];

  isLimitExceeded = false;

  render() {
    const onEnter = (value, { inputValue }) => {
      if (value.length >= 3 && { inputValue }) {
        MessagePlugin.warning('最多只能输入 3 个标签!');
      }
      this.update();
    };

    const onChange = (value) => {
      this.tags = value;
      if (value.length <= 3) {
        this.isLimitExceeded = false;
      }
      this.update();
    };

    return (
      <div style={{ width: '100%' }}>
        {this.isLimitExceeded && <t-alert theme="error" message="最多只能输入 3 个标签!" />}
        <t-tag-input
          value={this.tags}
          placeholder="最多只能输入 3 个标签"
          max={3}
          onEnter={onEnter}
          onChange={onChange}
        />
      </div>
    );
  }
}
