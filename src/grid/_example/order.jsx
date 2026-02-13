import 'tdesign-web-components/grid';

import css from 'tdesign-web-components/grid/_example/common.css?inline';

export default function OrderGrid() {
  return (
    <>
      <t-row>通过 `order` 来改变元素的排序。</t-row>
      <t-row css={css}>
        <t-col span={3} order={4} content={<div>1 col-order-4</div>}></t-col>
        <t-col span={3} order={3} content={<div>2 col-order-3</div>}></t-col>
        <t-col span={3} order={2} content={<div>3 col-order-2</div>}></t-col>
        <t-col span={3} order={1} content={<div>4 col-order-1</div>}></t-col>
      </t-row>
      <t-row css={css}>
        <t-col
          span={3}
          xs={{ order: 1 }}
          sm={{ order: 2 }}
          md={{ order: 3 }}
          lg={{ order: 4 }}
          content={<div>1 col-order-responsive</div>}
        ></t-col>
        <t-col
          span={3}
          xs={{ order: 2 }}
          sm={{ order: 1 }}
          md={{ order: 4 }}
          lg={{ order: 3 }}
          content={<div>2 col-order-responsive</div>}
        ></t-col>
        <t-col
          span={3}
          xs={{ order: 3 }}
          sm={{ order: 4 }}
          md={{ order: 2 }}
          lg={{ order: 1 }}
          content={<div>3 col-order-responsive</div>}
        ></t-col>
        <t-col
          span={3}
          xs={{ order: 4 }}
          sm={{ order: 3 }}
          md={{ order: 1 }}
          lg={{ order: 2 }}
          content={<div>4 col-order-responsive</div>}
        ></t-col>
      </t-row>
    </>
  );
}
