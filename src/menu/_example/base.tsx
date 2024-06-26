import 'tdesign-web-components/icon';
import 'tdesign-web-components/menu';

export default function Menu() {
  return (
    <div style={{ gap: 16, display: 'inline-flex' }}>
      <t-menu>
        <span slot="logo">LOGO</span>
        <t-menu-item label="123" value="1" icon={<t-icon name="activity" />}></t-menu-item>
      </t-menu>
    </div>
  );
}
