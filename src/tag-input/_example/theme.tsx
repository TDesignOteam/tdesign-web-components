import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputTheme extends Component {
  tags = ['Vue', 'React', 'Omi', 'Miniprogram'];

  render() {
    const setTags = (value) => {
      this.tags = value;
      this.update();
    };

    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        <t-tag-input value={this.tags} onChange={setTags} tagProps={{ theme: 'primary' }} />
        <t-tag-input value={this.tags} onChange={setTags} tagProps={{ theme: 'success' }} />
        <t-tag-input value={this.tags} onChange={setTags} tagProps={{ theme: 'warning' }} />
        <t-tag-input value={this.tags} onChange={setTags} tagProps={{ theme: 'danger' }} />
      </t-space>
    );
  }
}
