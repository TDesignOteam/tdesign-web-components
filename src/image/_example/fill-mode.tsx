import 'tdesign-web-components/image';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class ImageFillMode extends Component {
  render() {
    return (
      <t-space breakLine size={16}>
        {['fill', 'contain', 'cover', 'none', 'scale-down'].map((item) => (
          <t-space direction="vertical" align="left" key={item}>
            {item}
          </t-space>
        ))}
      </t-space>
    );
  }
}
