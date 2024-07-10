import 'tdesign-web-components/image';
import 'tdesign-web-components/avatar';
import 'tdesign-web-components/space';
import 'tdesign-icons-web-components';

import { Component } from 'omi';

export default class Avatar extends Component {
  static css = 't-avatar{}';

  render() {
    return (
      <t-space>
        <t-avatar icon={<t-icon name="user-1" className="mb-[2px]"></t-icon>} style={{ marginRight: '40px' }} />
        <t-avatar
          image="https://tdesign.gtimg.com/site/avatar.jpg"
          hideOnLoadFailed={false}
          style={{ marginRight: '40px' }}
        />
        <t-avatar style={{ marginRight: '40px' }}>W</t-avatar>
      </t-space>
    );
  }
}
