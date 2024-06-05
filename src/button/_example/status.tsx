import 'tdesign-web-components/button';

export default function Button() {
  return (
    <div style={{ gap: 16, display: 'inline-flex' }}>
      <t-button disabled>填充按钮</t-button>
      <t-button loading>加载中</t-button>
    </div>
  );
}
