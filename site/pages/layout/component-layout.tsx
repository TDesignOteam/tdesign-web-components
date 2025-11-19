import './td-wc-content/index.tsx';

import { Component, tag, VNode } from 'omi';
import styles from 'tdesign-site-components/lib/styles/style.css?raw';

import packageJson from '../../../package.json';
import sidebarConfig from '../../sidebar.config.ts';

const routerList = JSON.parse(JSON.stringify(sidebarConfig).replace(/component:.+/g, ''));
const currentVersion = packageJson.version;
@tag('component-layout')
export class ComponentLayout extends Component<{ children?: VNode | VNode[] }> {
  asideRef: Element | null = null;

  toc: Element | null = null;

  contentRef: Element | null = null;

  asideChange = ({ detail }: any) => {
    if (window.location.pathname === detail) return;
    window.location.pathname = detail;
  };

  ready(): void {
    this.asideRef?.addEventListener?.('change', this.asideChange);
  }

  uninstall(): void {
    this.asideRef?.removeEventListener?.('change', this.asideChange);
  }

  render() {
    return (
      <>
        <td-doc-layout style={styles}>
          <td-header framework="web-components" slot="header">
            <td-doc-search slot="search" docsearchInfo="搜索" />
          </td-header>
          <td-doc-aside ref={(e: any) => (this.asideRef = e)} title="Web Components" routerList={routerList}>
            <td-select
              value={currentVersion}
              options={[{ label: currentVersion, value: currentVersion }]}
              slot="extra"
            ></td-select>
          </td-doc-aside>
          <slot></slot>
        </td-doc-layout>
        {/* <td-theme-generator /> */}
      </>
    );
  }
}
