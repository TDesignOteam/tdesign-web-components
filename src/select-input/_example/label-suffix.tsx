import 'tdesign-web-components/select-input';
import 'tdesign-icons-web-components/esm/components/chevron-down';

import { Component, signal } from 'omi';
import { PopupVisibleChangeContext } from 'tdesign-web-components/popup';

const classStyles = `
<style>
.tdesign-demo__select-input-ul-label-suffix {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tdesign-demo__select-input-ul-label-suffix > li {
  display: block;
  border-radius: 3px;
  line-height: 22px;
  cursor: pointer;
  padding: 3px 8px;
  color: var(--td-text-color-primary);
  transition: background-color 0.2s linear;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tdesign-demo__select-input-ul-label-suffix > li:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>
`;

const OPTIONS = [
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: 4 },
  { label: 'tdesign-mobile-vue', value: 5 },
  { label: 'tdesign-mobile-react', value: 6 },
];

export default class SelectInputSingle extends Component {
  selectValue = signal({ label: 'tdesign-vue', value: 1 });

  popupVisible = signal(false);

  popupVisible2 = signal(false);

  onOptionClick = (item: { label: string; value: number }) => {
    this.selectValue.value = item;
    // 选中后立即关闭浮层
    this.popupVisible.value = false;
    this.popupVisible2.value = false;
  };

  onClear = () => {
    this.selectValue.value = undefined;
  };

  onPopupVisibleChange = (val: boolean, context: PopupVisibleChangeContext) => {
    console.log(context);
    this.popupVisible.value = val;
  };

  onPopupVisibleChange2 = (val: boolean) => {
    this.popupVisible2.value = val;
  };

  installed(): void {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }

  render() {
    return (
      <div>
        {/* <!-- :popup-props="{ trigger: 'hover' }" --> */}
        <t-select-input
          value={this.selectValue.value}
          popupVisible={this.popupVisible.value}
          style={{ width: '300px' }}
          label={<span>前置内容：</span>}
          placeholder="Please Select"
          clearable
          popupProps={{ overlayInnerStyle: { padding: 6 } }}
          onPopupVisibleChange={this.onPopupVisibleChange}
          onClear={this.onClear}
          panel={
            <ul className="tdesign-demo__select-input-ul-label-suffix">
              {OPTIONS.map((item) => (
                <li key={item.value} onClick={() => this.onOptionClick(item)}>
                  {item.label}
                </li>
              ))}
            </ul>
          }
          suffixIcon={<t-icon-chevron-down />}
        />
        <br /> <br />
        <t-select-input
          value={this.selectValue.value}
          popupVisible={this.popupVisible2.value}
          style={{ width: '300px' }}
          suffix={<span>单位：元</span>}
          placeholder="Please Select"
          clearable
          popupProps={{ overlayInnerStyle: { padding: 6 } }}
          onPopupVisibleChange={this.onPopupVisibleChange2}
          onClear={this.onClear}
          panel={
            <ul className="tdesign-demo__select-input-ul-label-suffix">
              {OPTIONS.map((item) => (
                <li key={item.value} onClick={() => this.onOptionClick(item)}>
                  {item.label}
                </li>
              ))}
            </ul>
          }
          suffixIcon={<t-icon-chevron-down />}
        />
      </div>
    );
  }
}
