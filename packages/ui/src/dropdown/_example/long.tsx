import '@tdesign/web-components-ui/button';
import '@tdesign/web-components-ui/dropdown';

import { MessagePlugin } from '@tdesign/web-components-ui/message';

export default function BasicDropdown() {
  const options = Array.from({ length: 20 }).map((v, k) => ({
    content: `选项${k + 1}`,
    value: k + 1,
  }));
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <t-dropdown options={options} onClick={clickHandler} maxHeight={400} minColumnWidth={'90px'}>
      <t-button>hover我试试</t-button>
    </t-dropdown>
  );
}
