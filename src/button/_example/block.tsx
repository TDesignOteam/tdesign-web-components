import 'tdesign-web-components/button';

export default function Button() {
  return (
    <div style={{ gap: 16, display: 'inline-flex', flexDirection: 'column', width: '100%' }}>
      <t-button block variant="base">
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
    </div>
  );
}
