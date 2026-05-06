import 'tdesign-web-components/watermark';

import { Component } from 'omi';

export default class ImageWatermark extends Component {
  render() {
    return (
      <t-watermark
        watermarkContent={{ url: 'https://tdesign.gtimg.com/site/logo-watermark.svg' }}
        width={104}
        height={65.5}
        x={90}
        y={100}
        rotate={0}
      >
        <div style={{ height: 300 }}></div>
      </t-watermark>
    );
  }
}
