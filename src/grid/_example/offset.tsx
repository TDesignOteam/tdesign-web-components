import 'tdesign-web-components/grid';

import css from 'tdesign-web-components/grid/_example/common.css?inline';

export default function OffsetGrid() {
  return (
    <>
      <t-row css={css}>
        <t-col span={4} content={<div>col-4</div>}></t-col>
        <t-col span={4} offset={4} content={<div>col-4</div>}></t-col>
      </t-row>
      <t-row css={css}>
        <t-col span={3} offset={3} content={<div>col-3 col-offset-3</div>}></t-col>
        <t-col span={3} offset={3} content={<div>col-3 col-offset-3</div>}></t-col>
      </t-row>
      <t-row css={css}>
        <t-col span={6} offset={2} content={<div>col-6 col-offset-2</div>}></t-col>
      </t-row>
    </>
  );
}
