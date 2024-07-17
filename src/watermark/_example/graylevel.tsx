import 'tdesign-web-components/watermark';

import { Component } from 'omi';

export default class GraylevelWatermark extends Component {
  render() {
    return (
      <t-watermark watermarkContent={{ text: '文字水印' }} x={80} y={120}>
        <div style={{ height: 300 }}></div>
      </t-watermark>
    );
  }
}
