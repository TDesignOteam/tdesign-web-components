import 'tdesign-web-components/button';
import 'tdesign-web-components/dropdown';
import 'tdesign-icons-web-components';

import { DropdownProps } from 'tdesign-web-components';

import { MessagePlugin } from '../../message';

export default function BasicDropdown() {
  const options = [
    {
      content: '选项一',
      value: 1,
      prefixIcon: <t-icon name="discount" />,
    },
    {
      content: '选项二',
      value: 2,
      prefixIcon: <t-icon name="discount" />,
    },
    {
      content: '选项三',
      value: 3,
      prefixIcon: <t-icon name="discount" />,
    },
    {
      content: '选项四',
      value: 4,
      prefixIcon: <t-icon name="discount" />,
      children: [
        {
          content: '选项五',
          value: 5,
          prefixIcon: <t-icon name="discount" />,
        },
        {
          content: '选项六',
          value: 6,
          prefixIcon: <t-icon name="discount" />,
        },
      ],
    },
  ];
  const clickHandler: DropdownProps['onClick'] = (data) => {
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
