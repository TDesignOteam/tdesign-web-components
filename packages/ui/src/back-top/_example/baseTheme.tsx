import 'tdesign-web-components/space';
import 'tdesign-web-components/back-top';

import { Component } from 'omi';

export default class BackTop extends Component {
  render() {
    const style = {
      position: 'relative',
      insetInlineEnd: 0,
      insetBlockEnd: 0,
    };
    return (
      <t-space direction="vertical" size={32}>
        <t-space size={24}>
          <t-back-top style={style} visibleHeight={0} container={() => document} />
          <t-back-top style={style} visibleHeight={0} theme={'primary'} container={() => document} />
          <t-back-top style={style} visibleHeight={0} theme={'dark'} container={() => document} />
        </t-space>
        <t-space size={24}>
          <t-back-top style={style} visibleHeight={0} shape="circle" container={() => document} />
          <t-back-top style={style} visibleHeight={0} shape="circle" theme="primary" container={() => document} />
          <t-back-top style={style} visibleHeight={0} shape="circle" theme="dark" container={() => document} />
        </t-space>
        <t-space size={24}>
          <t-back-top style={style} visibleHeight={0} size={'small'} container={() => document} />
          <t-back-top style={style} visibleHeight={0} size={'small'} theme={'primary'} container={() => document} />
          <t-back-top style={style} visibleHeight={0} size={'small'} theme={'dark'} container={() => document} />
        </t-space>
        <t-space size={24}>
          <t-back-top style={style} visibleHeight={0} size={'small'} shape="circle" container={() => document} />
          <t-back-top
            style={style}
            visibleHeight={0}
            size={'small'}
            shape="circle"
            theme="primary"
            container={() => document}
          />
          <t-back-top
            style={style}
            visibleHeight={0}
            size={'small'}
            shape="circle"
            theme="dark"
            container={() => document}
          />
        </t-space>
      </t-space>
    );
  }
}
