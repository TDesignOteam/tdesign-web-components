import '@tdesign/web-components-ui/range-input';
import '@tdesign/web-components-ui/space';

export default function RangeInput() {
  return (
    <t-space direction="vertical">
      <t-range-input size="small" />
      <t-range-input />
      <t-range-input size="large" />
    </t-space>
  );
}
