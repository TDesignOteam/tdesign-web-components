import 'tdesign-web-components/space';
import 'tdesign-icons-web-components/esm/components/letters-t';
import 'tdesign-icons-web-components/esm/components/letters-d';
import 'tdesign-icons-web-components/esm/components/letters-e';
import 'tdesign-icons-web-components/esm/components/letters-s';
import 'tdesign-icons-web-components/esm/components/letters-i';
import 'tdesign-icons-web-components/esm/components/letters-g';
import 'tdesign-icons-web-components/esm/components/letters-n';
import 'tdesign-icons-web-components/esm/components/component-checkbox';
import 'tdesign-icons-web-components/esm/components/component-breadcrumb';
import 'tdesign-icons-web-components/esm/components/component-input';
import 'tdesign-icons-web-components/esm/components/component-switch';
import 'tdesign-icons-web-components/esm/components/component-dropdown';
import 'tdesign-icons-web-components/esm/components/component-radio';
import 'tdesign-icons-web-components/esm/components/component-steps';

export default function IconExample() {
  return (
    <t-space direction="vertical">
      <t-space breakLine style={{ color: `var(--td-brand-color)` }}>
        <t-icon-letters-t />
        <t-icon-letters-d />
        <t-icon-letters-e />
        <t-icon-letters-s />
        <t-icon-letters-i />
        <t-icon-letters-g />
        <t-icon-letters-n />
      </t-space>
      <t-space breakLine>
        <t-icon-component-checkbox />
        <t-icon-component-breadcrumb />
        <t-icon-component-input />
        <t-icon-component-switch />
        <t-icon-component-dropdown />
        <t-icon-component-radio />
        <t-icon-component-steps />
      </t-space>
    </t-space>
  );
}
