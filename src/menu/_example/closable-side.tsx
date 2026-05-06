import 'tdesign-web-components/button';
import 'tdesign-icons-web-components';
import 'tdesign-web-components/menu';

import { Component, signal } from 'omi';

export default class CloseableSide extends Component {
  collapsed = signal(false);

  active = signal('0');

  render() {
    return (
      <t-menu
        value={this.active.value}
        collapsed={this.collapsed.value}
        onChange={(evt) => {
          this.active.value = evt.detail;
        }}
      >
        <span slot="logo">LOGO</span>
        <t-menu-item label="仪表盘" value="0" icon={<t-icon name="app" />} />
        <t-menu-item label="资源列表" value="1" icon={<t-icon name="code" />} />
        <t-menu-item label="调度平台" value="2" icon={<t-icon name="file" />} />
        <t-menu-item label="精准监控" value="3" icon={<t-icon name="user" />} />
        <t-menu-item label="根目录" value="4" icon={<t-icon name="rollback" />} />
        <t-menu-item label="消息区" value="5" icon={<t-icon name="mail" />} />
        <t-button
          slot="operations"
          variant="text"
          shape="square"
          icon={<t-icon name="view-list" />}
          onClick={() => {
            this.collapsed.value = !this.collapsed.value;
          }}
        />
      </t-menu>
    );
  }
}
