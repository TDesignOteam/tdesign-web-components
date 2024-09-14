import 'tdesign-web-components/button';
import 'tdesign-web-components/space';
import 'tdesign-icons-web-components/esm/components/add';

export default function Button() {
  return (
    <t-space direction="vertical">
      <t-button block variant="base">
        <t-icon-add></t-icon-add>
        填充按钮
      </t-button>
      <t-button block variant="outline">
        描边按钮
      </t-button>
      <t-button block variant="dashed">
        虚框按钮
      </t-button>
      <t-button block variant="text">
        文字按钮
      </t-button>
    </t-space>
  );
}
