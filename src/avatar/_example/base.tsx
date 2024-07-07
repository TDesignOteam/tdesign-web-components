import 'tdesign-web-components/image';
import 'tdesign-web-components/avatar';
import 'tdesign-web-components/space';
import 'tdesign-web-components/icon';

// import 'tdesign-icons-omi/user'
import { Component } from 'omi';

export default class Avatar extends Component {
  static css = 't-avatar{}';

  render() {
    return (
      <t-space>
        <t-avatar icon={<t-icon name="user-1"></t-icon>} style={{ marginRight: '40px' }} />
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
