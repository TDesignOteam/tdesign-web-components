import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputSize extends Component {
  tags1 = ['Vue', 'React', 'Omi'];

  tags2 = ['Vue', 'React', 'Omi'];

  tags3 = ['Vue', 'React', 'Omi'];

  render() {
    const setTags1 = (value) => {
      this.tags1 = value;
      this.update();
    };

    const setTags2 = (value) => {
      this.tags2 = value;
      this.update();
    };

    const setTags3 = (value) => {
      this.tags3 = value;
      this.update();
    };

    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        <t-tag-input value={this.tags1} onChange={setTags1} size="small" clearable />
        <t-tag-input value={this.tags2} onChange={setTags2} clearable />
        <t-tag-input value={this.tags3} onChange={setTags3} size="large" clearable />
      </t-space>
    );
  }
}
