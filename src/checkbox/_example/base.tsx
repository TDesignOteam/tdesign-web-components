import 'tdesign-web-components/checkbox';
import 'tdesign-web-components/space';

export default function CheckboxExample() {
  return (
    <t-space size="large">
      <t-checkbox label="未选中项"></t-checkbox>
      <t-checkbox label="半选状态" indeterminate></t-checkbox>
      <t-checkbox label="选中项" defaultChecked={true}></t-checkbox>
      <t-checkbox label="未选禁用项" disabled></t-checkbox>
      <t-checkbox label="选中禁用项" disabled defaultChecked></t-checkbox>
    </t-space>
  );
}
