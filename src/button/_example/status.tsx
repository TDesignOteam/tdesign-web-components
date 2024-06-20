import 'tdesign-web-components/button';
import 'tdesign-web-components/space';

export default function Button() {
  return (
    <t-space>
      <t-button disabled>填充按钮</t-button>
      <t-button loading>加载中</t-button>
    </t-space>
  );
}
