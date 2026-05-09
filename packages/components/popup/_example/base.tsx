import '@tdesign/web-components-ui/button';
import '@tdesign/web-components-ui/popup';

export default function BasicUsage() {
  return (
    <t-popup trigger="hover" showArrow content="这是一个弹出框" placement="left-bottom">
      <t-button>Hover me</t-button>
    </t-popup>
  );
}
