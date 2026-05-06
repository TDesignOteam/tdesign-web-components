import 'tdesign-web-components/link';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class InputBase extends Component {
  render() {
    return (
      <>
        <t-space>
          <t-link theme="default" href="https://www.tdesign.tencent.com/" underline>
            跳转链接
          </t-link>
          <t-link theme="primary" href="https://www.tdesign.tencent.com/" underline>
            跳转链接
          </t-link>
          <t-link theme="warning" href="https://www.tdesign.tencent.com/" underline>
            跳转链接
          </t-link>
          <t-link theme="danger" href="https://www.tdesign.tencent.com/" underline>
            跳转链接
          </t-link>
          <t-link theme="success" href="https://www.tdesign.tencent.com/" underline>
            跳转链接
          </t-link>
        </t-space>
      </>
    );
  }
}
