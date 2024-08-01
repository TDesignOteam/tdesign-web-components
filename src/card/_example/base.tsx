import 'tdesign-web-components/card';

import { Component } from 'omi';

export default class Button extends Component {
  render() {
    return (
      <t-card bordered hoverShadow style={{ width: '400px' }}>
        仅有内容区域的卡片形式。卡片内容区域可以是文字、图片、表单、表格等形式信息内容。可使用大中小不同的卡片尺寸，按业务需求进行呈现。
      </t-card>
    );
  }
}
