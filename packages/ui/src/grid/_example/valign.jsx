import 'tdesign-web-components/grid';

import css from 'tdesign-web-components/grid/_example/common.css';

export default function OrderGrid() {
  const colRender = () =>
    Array(4)
      .fill(3)
      .map((i, j) => <t-col span={i} content={<div style={{ height: j % 2 === 0 ? 80 : 40 }}>col-3</div>}></t-col>);
  return (
    <>
      <p>align top</p>
      <t-row justify="center" align="top" css={css}>
        {colRender()}
      </t-row>

      <p>Align Middle</p>
      <t-row justify="space-around" align="middle" css={css}>
        {colRender()}
      </t-row>

      <p>Align Bottom</p>
      <t-row justify="space-between" align="bottom" css={css}>
        {colRender()}
      </t-row>
    </>
  );
}
