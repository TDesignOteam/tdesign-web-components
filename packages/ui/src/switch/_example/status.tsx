import 'tdesign-web-components/switch';
import 'tdesign-web-components/space';

export default function SwitchBasic() {
  return (
    <t-space>
      <t-switch size="large" defaultValue />
      <t-switch size="large" defaultValue loading />
      <t-switch size="large" disabled />
    </t-space>
  );
}
