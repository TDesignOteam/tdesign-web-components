import 'tdesign-web-components/card';
import 'tdesign-web-components/comment';

import { Component } from 'omi';

export default class Button extends Component {
  render() {
    return (
      <>
        <t-card
          bordered
          theme="poster2"
          cover="https://tdesign.gtimg.com/site/source/card-demo.png"
          style={{ width: '400px' }}
          footer={<t-comment></t-comment>}
        ></t-card>
      </>
    );
  }
}
