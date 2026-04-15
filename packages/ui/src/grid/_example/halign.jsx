import 'tdesign-web-components/grid';

import css from 'tdesign-web-components/grid/_example/common.css';

export default function OrderGrid() {
  const colRender = () =>
    Array(4)
      .fill(4)
      .map(() => <t-col span={2} content={<div>col-2</div>}></t-col>);
  return (
    <>
      <p>align left</p>
      <t-row justify="start" css={css}>
        {colRender()}
      </t-row>

      <p>align center</p>
      <t-row justify="center" css={css}>
        {colRender()}
      </t-row>

      <p>align right</p>
      <t-row justify="end" css={css}>
        {colRender()}
      </t-row>

      <p>space-between</p>
      <t-row justify="space-between" css={css}>
        {colRender()}
      </t-row>

      <p>space-around</p>
      <t-row justify="space-around" css={css}>
        {colRender()}
      </t-row>
    </>
  );
}
