import 'tdesign-web-components/tag';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagSize extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-space align="center">
          <t-tag size="small">小型标签</t-tag>
          <t-tag size="medium">默认标签</t-tag>
          <t-tag size="large">大型标签</t-tag>
        </t-space>
        <t-space align="center">
          <t-tag size="small">小型标签</t-tag>
          <t-tag size="medium">默认标签</t-tag>
          <t-tag size="large">大型标签</t-tag>
        </t-space>
      </t-space>
    );
  }
}
