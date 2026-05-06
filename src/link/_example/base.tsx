import 'tdesign-web-components/link';

import { Component } from 'omi';

export default class InputBase extends Component {
  render() {
    return (
      <>
        <t-link theme="primary" href="https://tdesign.tencent.com/" target="_blank">
          跳转链接
        </t-link>
      </>
    );
  }
}
