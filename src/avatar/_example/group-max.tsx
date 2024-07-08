import 'tdesign-web-components/avatar';
import 'tdesign-web-components/space';
import 'tdesign-web-components/avatar/avatar-group';
import 'tdesign-web-components/icon';
import 'tdesign-web-components/image';

import { Component } from 'omi';

export default class AvatarGroupMax extends Component {
  static css = 't-avatar{}';

  render() {
    return (
      <t-space direction="vertical">
        <t-avatar-group size="large" max={2}>
          <t-avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></t-avatar>
          <t-avatar content="Avatar"></t-avatar>
          <t-avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></t-avatar>
        </t-avatar-group>

        <t-avatar-group size="large" max={2} collapseAvatar={<t-icon name="ellipsis" />}>
          <t-avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></t-avatar>
          <t-avatar content="Avatar"></t-avatar>
          <t-avatar icon={<t-icon name="user-1"></t-icon>}></t-avatar>
        </t-avatar-group>

        <t-avatar-group size="large" max={2} collapseAvatar="more">
          <t-avatar image="https://tdesign.gtimg.com/site/avatar.jpg"></t-avatar>
          <t-avatar content="Avatar"></t-avatar>
          <t-avatar icon={<t-icon name="user-1"></t-icon>}></t-avatar>
        </t-avatar-group>
      </t-space>
    );
  }
}
