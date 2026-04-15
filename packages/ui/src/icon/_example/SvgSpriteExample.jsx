import 'tdesign-icons-web-components';
import 'tdesign-web-components/space';

export default function SvgSpriteExample() {
  return (
    <t-space direction="vertical">
      <t-space break-line>
        <p>How do you feel today?</p>
        <t-icon name="sneer" />
        <t-icon name="unhappy" />
        <t-icon name="excited" />
        <t-icon name="surprised" />
        <t-icon name="giggle" />
      </t-space>
      <t-space breakLine align="center">
        <p>What is your favourite food?</p>
        <t-icon name="tangerinr" color="orange" />
        <t-icon name="bamboo-shoot" color="green" />
        <t-icon name="apple" color="red" />
        <t-icon name="milk" color="#0052D9" />
        <t-icon name="peach" color="pink" />
      </t-space>
      <t-space break-line>
        <p>How much icons does TDesign Icon includes?</p>
        <t-icon name="numbers-1" style={{ color: 'var(--td-brand-color-5)' }} />
        <t-icon name="numbers-2" style={{ color: 'var(--td-brand-color-6)' }} />
        <t-icon name="numbers-0" style={{ color: 'var(--td-brand-color-7)' }} />
        <t-icon name="numbers-3" style={{ color: 'var(--td-brand-color-8)' }} />
      </t-space>
    </t-space>
  );
}
