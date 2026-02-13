import 'tdesign-web-components/grid';

import css from 'tdesign-web-components/grid/_example/common.css?inline';

export default function SpaceGrid() {
  const colRender = (num, span = 3) =>
    Array(num)
      .fill(3)
      .map(() => <t-col span={span} content={<div>col-3</div>}></t-col>);
  return (
    <>
      <t-row css={css} gutter={16}>
        {colRender(4)}
      </t-row>

      <t-row css={css} gutter={{ xs: 8, sm: 16, md: 24, lg: 32, xl: 32, xxl: 40 }}>
        {colRender(4)}
      </t-row>

      <t-row css={css} gutter={[16, 24]}>
        {colRender(8)}
      </t-row>
    </>
  );
}
