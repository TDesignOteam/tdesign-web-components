import 'tdesign-web-components/select-input';

const classStyles = `
<style>
.tdesign-demo__select-empty-width {
  text-align: center;
  color: var(--td-text-color-disabled);
  line-height: 32px;
}
.tdesign-demo__select-input-width .t-input__wrap {
  width: 380px;
  vertical-align: middle;
  display: inline-flex;
}

.tdesign-demo__select-input-width .t-demo-normal {
  width: 380px;
  vertical-align: middle;
  display: inline-flex;
}
</style>
`;

export default function SelectInputWidth() {
  const selectValue = 'TDesign';

  // 添加示例代码所需样式
  document.head.insertAdjacentHTML('beforeend', classStyles);

  return (
    <div className="tdesign-demo__select-input-width">
      <div>
        <span>下拉框默认宽度：</span>
        <t-select-input
          value={selectValue}
          placeholder="Please Select"
          className="t-demo-normal"
          panel={<div className="tdesign-demo__select-empty-width">下拉框宽度和触发元素宽度保持一致（默认）</div>}
        ></t-select-input>
      </div>
      <br />

      <div>
        <span>下拉框最大宽度：</span>
        <t-select-input
          value={selectValue}
          placeholder="Please Select"
          className="t-demo-normal"
          panel={
            <div className="tdesign-demo__select-empty-width">
              下拉框宽度和触发元素宽度保持一致，但是当下拉框内容宽度超出时，自动撑开下拉框宽度，最大不超过
              1000px（默认）
            </div>
          }
        ></t-select-input>
      </div>
      <br />

      <div>
        <span>与内容宽度一致：</span>
        <t-select-input
          value={selectValue}
          popupProps={{
            overlayInnerStyle: { width: 'auto' },
          }}
          placeholder="Please Select"
          className="t-demo-normal"
          panel={<div className="tdesign-demo__select-empty-width">宽度随内容宽度自适应</div>}
        ></t-select-input>
      </div>
      <br />

      <div>
        <span>下拉框固定宽度：</span>
        <t-select-input
          value={selectValue}
          popupProps={{
            overlayInnerStyle: { width: '360px' },
          }}
          placeholder="Please Select"
          className="t-demo-normal"
          panel={<div className="tdesign-demo__select-empty-width">固定宽度 360px</div>}
        ></t-select-input>
      </div>
      <br />
    </div>
  );
}
