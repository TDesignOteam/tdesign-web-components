import 'tdesign-web-components/watermark';

import { Component } from 'omi';

export default class MovingImageWatermark extends Component {
  render() {
    return (
      <t-watermark
        watermarkContent={{ url: 'https://tdesign.gtimg.com/starter/brand-logo-light.png' }}
        movable
        width={158}
        height={22}
      >
        <div style={{ height: 300 }}></div>
      </t-watermark>
    );
  }
}
