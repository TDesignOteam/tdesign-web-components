import 'tdesign-web-components/avatar';
import 'tdesign-web-components/space';
import 'tdesign-web-components/avatar/avatar-group';
import 'tdesign-web-components/icon';

// import 'tdesign-icons-omi/user'
import { Component } from 'omi';

export default class AvatarGroup extends Component {
  static css = 't-avatar{}';

  render() {
    return (
      <t-space direction="vertical">
        <t-avatar-group cascading="right-up">
          <t-avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></t-avatar>
          <t-avatar content="W"></t-avatar>
          <t-avatar icon={<t-icon name="user-1" className="mb-[2px]"></t-icon>}></t-avatar>
        </t-avatar-group>

        <t-avatar-group size="large" cascading="left-up">
          <t-avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></t-avatar>
          <t-avatar content="W"></t-avatar>
          <t-avatar icon={<t-icon name="user-1" className="mb-[2px]"></t-icon>}></t-avatar>
        </t-avatar-group>
      </t-space>
    );
  }
}
