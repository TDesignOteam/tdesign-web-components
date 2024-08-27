import 'tdesign-icons-web-components/esm/iconfont/index.css';
import 'tdesign-icons-web-components/esm/iconfont';
import 'tdesign-web-components/space';

export default function IconFontExample() {
  return (
    <t-space direction="vertical">
      <t-space break-line>
        <p>How do you feel today?</p>
        <t-icon-font name="sneer" />
        <t-icon-font name="unhappy" />
        <t-icon-font name="excited" />
        <t-icon-font name="surprised" />
        <t-icon-font name="giggle" />
      </t-space>
      <t-space breakLine align="center">
        <p>What is your favourite food?</p>
        <t-icon-font name="tangerinr" style={{ color: 'orange' }} />
        <t-icon-font name="bamboo-shoot" style={{ color: 'green' }} />
        <t-icon-font name="apple" style={{ color: 'red' }} />
        <t-icon-font name="milk" style={{ color: '#0052D9' }} />
        <t-icon-font name="peach" style={{ color: 'pink' }} />
      </t-space>
      <t-space break-line>
        <p>How much icons does TDesign Icon includes?</p>
        <t-icon-font name="numbers-1" style={{ color: 'var(--td-brand-color-5)' }} />
        <t-icon-font name="numbers-2" style={{ color: 'var(--td-brand-color-6)' }} />
        <t-icon-font name="numbers-0" style={{ color: 'var(--td-brand-color-7)' }} />
        <t-icon-font name="numbers-3" style={{ color: 'var(--td-brand-color-8)' }} />
      </t-space>
    </t-space>
  );
}
