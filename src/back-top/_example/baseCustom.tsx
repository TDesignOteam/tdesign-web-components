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
      <t-space size={24}>
        <t-back-top style={style} visibleHeight={0} container={() => document}>
          <span className="custom-node">返回</span>
        </t-back-top>
        <t-back-top style={style} content={<span>TOP</span>} visibleHeight={0} container={() => document} />
        <t-back-top style={style} content={<span>UP</span>} visibleHeight={0} container={() => document} />
      </t-space>
    );
  }
}
