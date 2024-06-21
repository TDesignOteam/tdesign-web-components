import 'tdesign-web-components/button';
import 'tdesign-web-components/popup';

export default function BasicUsage() {
  return (
    <t-popup trigger="hover" showArrow content="这是一个弹出框" placement="left">
      <t-button>Hover me</t-button>
    </t-popup>
  );
}
