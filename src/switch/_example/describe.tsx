import 'tdesign-web-components/switch';
import 'tdesign-icons-web-components';
import 'tdesign-web-components/space';

export default function SwitchBasic() {
  const renderActiveContent = () => <t-icon name={'check'}></t-icon>;
  const renderInactiveContent = () => <t-icon name={'close'}></t-icon>;
  return (
    <t-space direction="column">
      <t-space>
        <t-switch size="large" label={['开', '关']} />
        <t-switch size="large" defaultValue label={['开', '关']} />
      </t-space>
      <t-space>
        <t-switch size="large" label={[renderActiveContent(), renderInactiveContent()]} />
        <t-switch size="large" defaultValue label={[renderActiveContent(), renderInactiveContent()]} />
      </t-space>
    </t-space>
  );
}
