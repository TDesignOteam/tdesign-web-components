import 'tdesign-web-components/dropdown';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components';

import { MessagePlugin } from '../../message';

export default function BasicDropdown() {
  const getContent = () => <div>操作四</div>;
  const options = [
    {
      content: '操作一',
      value: 1,
    },
    {
      content: '操作二',
      value: 2,
    },
    {
      content: '操作三',
      value: 3,
      disabled: true,
    },
    {
      content: getContent(),
      value: 4,
      disabled: true,
    },
  ];
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <t-dropdown options={options} onClick={clickHandler}>
      <t-button variant="text" suffix={<t-icon name="chevron-down" size="16" />}>
        更多
      </t-button>
    </t-dropdown>
  );
}
