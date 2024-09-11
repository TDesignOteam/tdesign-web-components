import 'tdesign-web-components/space';
import 'tdesign-web-components/tabs';

export default function SizeTabs() {
  return (
    <t-space direction="vertical" style={{ width: '100%' }}>
      <t-tabs placement={'top'} size="medium" theme="normal" disabled={false} defaultValue={'1'}>
        <t-tab-panel value={'1'} label={'选项卡1'}>
          <div style={{ margin: 20 }}>选项卡1内容区</div>
        </t-tab-panel>
        <t-tab-panel value={'2'} label={'选项卡2'}>
          <div style={{ margin: 20 }}>选项卡2内容区</div>
        </t-tab-panel>
      </t-tabs>
      <t-tabs placement={'top'} size="large" theme="normal" disabled={false} defaultValue={'1'}>
        <t-tab-panel value={'1'} label={'选项卡1'}>
          <div style={{ margin: 20 }}>选项卡1内容区</div>
        </t-tab-panel>
        <t-tab-panel value={'2'} label={'选项卡2'}>
          <div style={{ margin: 20 }}>选项卡2内容区</div>
        </t-tab-panel>
      </t-tabs>
    </t-space>
  );
}
