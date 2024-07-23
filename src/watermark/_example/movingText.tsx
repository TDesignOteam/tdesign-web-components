import 'tdesign-web-components/watermark';

import { Component } from 'omi';

export default class MovingTextWatermark extends Component {
  render() {
    return (
      <t-watermark watermarkContent={{ text: '©版权所有' }} movable>
        <div style={{ height: 300 }}></div>
      </t-watermark>
    );
  }
}
