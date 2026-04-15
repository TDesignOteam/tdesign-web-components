import 'tdesign-web-components/button';
import 'tdesign-web-components/dropdown';

import type { DropdownOption, DropdownProps } from 'tdesign-web-components/dropdown';

import { MessagePlugin } from '../../message';

export default function ThemeDropdown() {
  const options: DropdownOption[] = [
    {
      content: '选项一',
      value: 1,
      children: [
        {
          content: '选项九',
          value: 9,
        },
      ],
    },
    {
      content: '选项二',
      value: 3,
      children: [
        {
          content: '选项十',
          value: 10,
        },
      ],
    },
    {
      content: '危险操作',
      value: 4,
      theme: 'error',
      children: [
        {
          content: '危险操作一',
          value: 11,
          theme: 'error',
          children: [
            {
              content: '危险操作项',
              value: 13,
              theme: 'error',
            },
            {
              content: '操作项',
              value: 12,
            },
          ],
        },
      ] as DropdownOption[],
    },
  ];
  const clickHandler: DropdownProps['onClick'] = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <t-dropdown options={options.concat()} onClick={clickHandler} trigger="click">
      <t-button variant="text" suffix={<t-icon name="chevron-down" size="16" />}>
        更多
      </t-button>
    </t-dropdown>
  );
}
