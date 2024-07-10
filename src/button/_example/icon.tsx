import 'tdesign-web-components/button';
import 'tdesign-icons-web-components';
import 'tdesign-web-components/space';

export default function Button() {
  return (
    <t-space>
      <t-button icon={<t-icon name={'add'} className="mb-[2px]" />}>新建</t-button>
      <t-button variant="outline" icon={<t-icon name={'upload'} className="mb-[2px]" />}>
        上传文件
      </t-button>
      <t-button shape="circle" icon={<t-icon name={'discount'} className="mb-[2px]"></t-icon>} />
      <t-button shape="circle" icon={<t-icon name={'download'} className="mb-[2px]" />} />
      <t-button theme="default" variant="outline" icon={<t-icon name={'search'} className="mb-[2px]" />}>
        Function Icon
      </t-button>
    </t-space>
  );
}
