import 'tdesign-web-components/menu';

export default function Menu() {
  return (
    <div style={{ gap: 16, display: 'inline-flex' }}>
      <t-menu>
        <span slot="logo">LOGO</span>
        <t-menu-item label="123" value="1" className="dasdasd"></t-menu-item>
        <t-menu-item label="33333" value="2"></t-menu-item>
        <t-menu-item label="3434444444434343" value="3"></t-menu-item>
        {/* <span slot="operations">operations</span> */}
      </t-menu>
    </div>
  );
}
