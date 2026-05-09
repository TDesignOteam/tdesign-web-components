import '@tdesign/web-components-ui/space';
import '@tdesign/web-components-ui/button';
import '@tdesign/web-components-ui/divider';

export default function SpaceSeparator() {
  return (
    <t-space align="center" separator={<t-divider layout="vertical" />}>
      <t-button variant="text">Text</t-button>
      <t-button variant="text">Text</t-button>
      <t-button variant="text">Text</t-button>
    </t-space>
  );
}
