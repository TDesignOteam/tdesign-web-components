import 'tdesign-web-components/back-top';
import 'tdesign-web-components/list';

import { Component, createRef } from 'omi';

export default class BackTop extends Component {
  render() {
    const container = createRef();
    return (
      <div style={{ position: 'relative' }}>
        <div
          ref={container}
          class="demo-base"
          style={{
            position: 'relative',
            height: '280px',
            overflowY: 'scroll',
            border: '1px solid rgb(220, 220, 220)',
          }}
        >
          <t-list>
            {Array.from(Array(50), () => '列表内容').map((item, index) => (
              <t-list-item key={index} content={item}></t-list-item>
            ))}
          </t-list>
        </div>
        <t-back-top
          container={() => container.current}
          style={{ position: 'absolute' }}
          visibleHeight={46}
          shape="square"
          offset={['24px', '80px']}
          ignoreAttributes={['style']}
        />
      </div>
    );
  }
}
