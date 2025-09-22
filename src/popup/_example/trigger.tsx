import 'tdesign-web-components/button';
import 'tdesign-web-components/popup';
import 'tdesign-web-components/space';

export default function Triggers() {
  return (
    <t-popup trigger="hover" showArrow content="这是一个弹出框">
      <t-button variant="outline">悬浮时触发（默认）</t-button>
    </t-popup>
  );
}
