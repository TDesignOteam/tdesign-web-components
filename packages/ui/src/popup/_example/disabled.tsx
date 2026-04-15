import 'tdesign-web-components/button';
import 'tdesign-web-components/popup';

export default function Disabled() {
  return (
    <t-popup trigger="hover" disabled showArrow content="这是一个弹出框">
      <t-button>Hover me</t-button>
    </t-popup>
  );
}
