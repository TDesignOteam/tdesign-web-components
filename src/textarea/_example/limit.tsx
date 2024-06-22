import 'tdesign-web-components/textarea';
import 'tdesign-web-components/space';

export default function Textarea() {
  return (
    <t-space direction="vertical" style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
      <t-textarea placeholder="请输入描述文案，文本长度最多20，maxlength=20" maxlength="20"></t-textarea>
      <t-textarea
        placeholder="请输入描述文案，最多20字符（一个汉字占两个字符长度），maxcharacter=20"
        maxcharacter="20"
      ></t-textarea>
    </t-space>
  );
}
