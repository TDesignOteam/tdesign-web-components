import 'tdesign-web-components/tag';
import 'tdesign-icons-web-components/esm/components/discount';

import { Component } from 'omi';

export default class TagIcon extends Component {
  render() {
    return (
      <t-tag icon={<t-icon-discount />} theme="default">
        默认标签
      </t-tag>
    );
  }
}
