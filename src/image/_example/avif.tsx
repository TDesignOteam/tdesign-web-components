import 'tdesign-web-components/image';

import { Component,tag } from 'omi';

@tag('image-avif')
export default class ImageAvif extends Component {
  render() {
    return (
      <t-image
        src="https://tdesign.gtimg.com/img/tdesign-image.avif"
        srcset={{
          'image/avif': 'https://tdesign.gtimg.com/img/tdesign-image.avif',
          'image/webp': 'https://tdesign.gtimg.com/img/tdesign-image.webp',
        }}
        shape="square"
        style={{ maxWidth: '100%' }}
        fit="scale-down"
      ></t-image>
    );
  }
}
