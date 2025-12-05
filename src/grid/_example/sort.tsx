import 'tdesign-web-components/grid';

import css from 'tdesign-web-components/grid/_example/common.css?inline';

export default function PullPushGrid() {
  return (
    <>
      <t-row>通过 `pull` `push` 进行排序</t-row>
      <t-row css={css}>
        <t-col span={9} push={3} content={<div>col-9 col-push-3</div>}></t-col>
        <t-col css={css} span={3} pull={9} content={<div>col-3 col-pull-9</div>}></t-col>
      </t-row>
      <t-row css={css}>
        <t-col span={8} push={4} content={<div>col-8 col-push-4</div>}></t-col>
        <t-col span={4} pull={8} content={<div>col-4 col-pull-8</div>}></t-col>
      </t-row>
    </>
  );
}
