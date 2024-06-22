import 'tdesign-web-components/textarea';

export default function Textarea() {

  return (
    <div style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
        <t-textarea placeholder="请输入描述文案"></t-textarea>
        <t-textarea placeholder="请输入文案，高度可自适应；autosize=true" autosize={true}></t-textarea>
        <t-textarea placeholder="请输入文案，高度可自适应，最小3行，最大5行；autosize={minRows: 3, maxRows: 5}" autosize={{minRows: 3, maxRows: 5}}></t-textarea>
        </div>
  );
}
