import '@tdesign/web-components/button';
import '@tdesign/web-components/space';

export default function Button() {
  return (
    <t-space size={24}>
      <t-button tag="div">div</t-button>
      <t-button tag="a">a</t-button>
      <t-button href="#">a:href</t-button>
    </t-space>
  );
}
