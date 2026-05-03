import '@tdesign/web-components-ui/button';
import '@tdesign/web-components-ui/popup';

export default function PopupDestroy() {
  return (
    <t-popup trigger="hover" destroyOnClose content="这是一个弹出框">
      <t-button theme="primary">Hover me</t-button>
    </t-popup>
  );
}
