import 'tdesign-web-components/checkbox';
import 'tdesign-web-components/space';

export default function CheckboxExample() {
  return (
    <t-space size="large">
      <t-checkbox>未选中项</t-checkbox>
      <t-checkbox indeterminate>未选中项</t-checkbox>
      <t-checkbox defaultChecked={true}>选中项</t-checkbox>
      <t-checkbox disabled>未选禁用项</t-checkbox>
      <t-checkbox disabled defaultChecked>
        选中禁用项
      </t-checkbox>
    </t-space>
  );
}
