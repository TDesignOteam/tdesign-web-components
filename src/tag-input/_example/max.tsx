import 'tdesign-web-components/tag-input';

import { Component } from 'omi';
import { MessagePlugin } from 'tdesign-web-components';

export default class TagInputMax extends Component {
  tags = [];

  render() {
    return (
      <div style={{ width: '100%' }}>
        <t-tag-input
          defaultValue={this.tags}
          placeholder="最多只能输入 3 个标签"
          max={3}
          onExceed={() => {
            MessagePlugin.warning('最多只能输入 3 个标签!');
          }}
        />
      </div>
    );
  }
}
