import 'tdesign-web-components/tag';

import { Component } from 'omi';

export default class TagMaxwidth extends Component {
  render() {
    return <t-tag maxWidth={100}>默认超八个字超长文本标签超长省略文本标签</t-tag>;
  }
}
