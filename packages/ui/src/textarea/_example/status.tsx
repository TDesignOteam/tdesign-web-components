import 'tdesign-web-components/textarea';
import 'tdesign-web-components/space';

export default function Textarea() {
  return (
    <t-space direction="vertical" style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
      <t-textarea placeholder="禁用状态" disabled="true"></t-textarea>
      <t-textarea placeholder="只读状态" readonly="true"></t-textarea>
      <t-textarea placeholder="普通状态" readonly="true" tips="这是普通文本提示"></t-textarea>
      <t-textarea placeholder="成功状态" tips="校验通过文本提示" status="success"></t-textarea>
      <t-textarea placeholder="警告状态" tips="校验不通过文本提示" status="warning"></t-textarea>
      <t-textarea placeholder="错误状态" tips="校验存在严重问题文本提示" status="error"></t-textarea>
    </t-space>
  );
}
