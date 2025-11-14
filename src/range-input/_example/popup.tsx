import 'tdesign-web-components/range-input';
import 'tdesign-web-components/popup';
import 'tdesign-web-components/space';
import 'tdesign-icons-web-components/esm/components/calendar';

export default function RangeInputPopupExample() {
  return (
    <t-space direction="vertical">
      <t-range-input-popup panel={<div>这是一个浮层</div>} defaultInputValue={['2025-01-01', '默认输入']} />
      <t-range-input-popup panel={<div>这是一个浮层</div>} disabled />
    </t-space>
  );
}
