import 'tdesign-web-components/button';
import 'tdesign-icons-web-components';
import 'tdesign-web-components/space';

export default function Button() {
  return (
    <t-space>
      <t-button icon={<t-icon name={'add'} />}>新建</t-button>
      <t-button variant="outline" icon={<t-icon name={'upload'} />}>
        上传文件
      </t-button>
      <t-button shape="circle" icon={<t-icon name={'discount'}></t-icon>} />
      <t-button shape="circle" icon={<t-icon name={'download'} />} />
      <t-button theme="default" variant="outline" icon={<t-icon name={'search'} />}>
        Function Icon
      </t-button>
    </t-space>
  );
}
