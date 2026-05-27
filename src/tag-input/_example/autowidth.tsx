import 'tdesign-web-components/tag-input';

import { Component } from 'omi';

export default class TagInputAutoWidth extends Component {
  tags = ['Vue', 'React'];

  render() {
    return (
      <t-tag-input
        value={this.tags}
        autoWidth
        clearable
        onChange={(e: CustomEvent) => {
          this.tags = e.detail.value;
          this.update();
        }}
      />
    );
  }
}
