import '@tdesign/web-components-ui/button';
import '@tdesign/web-components-ui/tooltip';

export default function BasicUsage() {
  return (
    <t-tooltip content="文字提示仅展示文本内容">
      <t-button variant="outline">默认文字提示</t-button>
    </t-tooltip>
  );
}
