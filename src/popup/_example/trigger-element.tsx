import 'tdesign-web-components/space';
import 'tdesign-web-components/popup';
import 'tdesign-web-components/button';

export default function TriggerElement() {
  return (
    <t-space>
      <t-popup trigger="hover" showArrow content="这是一个弹出框">
        <t-button variant="outline">默认子节点元素触发</t-button>
      </t-popup>
      <t-popup
        triggerElement={<t-button>使用 triggerElement 元素触发</t-button>}
        showArrow
        content="这是一个弹出框"
      ></t-popup>
    </t-space>
  );
}
