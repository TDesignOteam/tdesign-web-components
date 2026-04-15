import 'tdesign-web-components/breadcrumb';

export default function Breadcrumb() {
  return (
    <>
      <t-breadcrumb>
        <t-breadcrumb-item>页面1</t-breadcrumb-item>
        <t-breadcrumb-item>页面2</t-breadcrumb-item>
        <t-breadcrumb-item>页面3</t-breadcrumb-item>
        <span slot="separator">{'>'}</span>
      </t-breadcrumb>
      <t-breadcrumb separator={'///'}>
        <t-breadcrumb-item>页面1</t-breadcrumb-item>
        <t-breadcrumb-item>页面2</t-breadcrumb-item>
        <t-breadcrumb-item>页面3</t-breadcrumb-item>
      </t-breadcrumb>
    </>
  );
}
