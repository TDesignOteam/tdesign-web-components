import '@tdesign/web-components-ui/button';
import '@tdesign/web-components-ui/popup';
import '@tdesign/web-components-ui/space';

export default function Controlled() {
  return (
    <t-popup content="这是popup内容" trigger="context-menu" placement="right" visible={true}>
      <t-button>一直显示</t-button>
    </t-popup>
  );
}
