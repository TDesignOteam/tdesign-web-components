import 'tdesign-web-components/grid';

import { Component } from 'omi';
import css from 'tdesign-web-components/grid/_example/common.css?inline';

const demoCols = [
  Array(12).fill(1),
  Array(6).fill(2),
  Array(4).fill(3),
  Array(3).fill(4),
  Array(2).fill(6),
  Array(1).fill(12),
];

export default class BasicGrid extends Component {
  render() {
    return (
      <>
        {demoCols.map((cols, i) => (
          <t-row key={i} css={css}>
            {cols.map((col, j) => (
              <t-col span={col} key={j} content={<div>{col}</div>}></t-col>
            ))}
          </t-row>
        ))}
      </>
    );
  }
}
