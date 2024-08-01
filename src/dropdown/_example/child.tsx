import 'tdesign-web-components/button';
import 'tdesign-web-components/dropdown';
import 'tdesign-icons-web-components';

import { DropdownProps } from 'tdesign-web-components';

import { MessagePlugin } from '../../message';

export default function BasicDropdown() {
  const clickHandler: DropdownProps['onClick'] = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <t-dropdown minColumnWidth={100} trigger="click">
      <t-button variant="text" suffix={<t-icon name="chevron-down" size="16" />}>
        更多
      </t-button>
      <t-dropdown-menu>
        <t-dropdown-item value={1}>
          操作一
          <t-dropdown-menu>
            <t-dropdown-item value={11}>操作1-1</t-dropdown-item>
            <t-dropdown-item value={12}>
              操作1-2
              <t-dropdown-menu>
                <t-dropdown-item value={111}>操作1-1-1</t-dropdown-item>
                <t-dropdown-item value={112}>操作1-1-2</t-dropdown-item>
              </t-dropdown-menu>
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown-item>
        <t-dropdown-item value={2}>
          操作二
          <t-dropdown-menu>
            <t-dropdown-item value={21}>
              操作2-1
              <t-dropdown-menu>
                <t-dropdown-item value={211}>操作2-1-1</t-dropdown-item>
                <t-dropdown-item value={211}>操作2-1-2</t-dropdown-item>
              </t-dropdown-menu>
            </t-dropdown-item>
            <t-dropdown-item value={22} onClick={clickHandler}>
              操作2-2
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown-item>
        <t-dropdown-item value={3}>操作三</t-dropdown-item>
      </t-dropdown-menu>
    </t-dropdown>
  );
}
