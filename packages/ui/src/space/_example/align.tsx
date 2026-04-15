import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

export default function SpaceAlign() {
  return (
    <t-space breakLine>
      <t-space align="start" style={{ padding: 12, border: '1px dashed var(--td-component-stroke)' }}>
        <div>start</div>
        <t-button>Button</t-button>
        <div style={{ background: 'var(--td-bg-color-component)', height: 60, width: 60 }}></div>
      </t-space>
      <t-space align="center" style={{ padding: 12, border: '1px dashed var(--td-component-stroke)' }}>
        <div>center</div>
        <t-button>Button</t-button>
        <div style={{ background: 'var(--td-bg-color-component)', height: 60, width: 60 }}></div>
      </t-space>
      <t-space align="end" style={{ padding: 12, border: '1px dashed var(--td-component-stroke)' }}>
        <div>end</div>
        <t-button>Button</t-button>
        <div style={{ background: 'var(--td-bg-color-component)', height: 60, width: 60 }}></div>
      </t-space>
      <t-space align="baseline" style={{ padding: 12, border: '1px dashed var(--td-component-stroke)' }}>
        <div>baseline</div>
        <t-button>Button</t-button>
        <div style={{ background: 'var(--td-bg-color-component)', height: 60, width: 60 }}></div>
      </t-space>
    </t-space>
  );
}
