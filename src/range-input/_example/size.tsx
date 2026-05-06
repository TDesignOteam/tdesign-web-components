import 'tdesign-web-components/range-input';
import 'tdesign-web-components/space';

export default function RangeInput() {
  return (
    <t-space direction="vertical">
      <t-range-input size="small" />
      <t-range-input />
      <t-range-input size="large" />
    </t-space>
  );
}
