import 'tdesign-web-components/button';
import 'tdesign-web-components/popup';
import 'tdesign-web-components/input';
import 'tdesign-web-components/space';

export default function Triggers() {
  return (
    <t-space>
      <t-popup trigger="hover" showArrow content="这是一个弹出框">
        <t-button variant="outline">悬浮时触发（默认）</t-button>
      </t-popup>
      <t-popup trigger="focus" showArrow content="这是一个弹出框">
        <t-input placeholder="获得焦点时触发" style={{ width: 200 }}></t-input>
      </t-popup>
      <t-popup trigger="click" showArrow content="这是一个弹出框">
        <t-button onClick={() => console.log('自定义事件')} variant="outline">
          点击时触发
        </t-button>
      </t-popup>
      <t-popup trigger="context-menu" showArrow content="这是一个弹出框">
        <t-button variant="outline">右击时触发</t-button>
      </t-popup>
    </t-space>
  );
}
