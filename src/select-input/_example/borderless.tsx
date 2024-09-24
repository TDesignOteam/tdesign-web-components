import 'tdesign-web-components/select-input';
import 'tdesign-icons-web-components/esm/components/chevron-down';

import { Component, signal } from 'omi';
import { SelectInputProps } from 'tdesign-web-components/select-input';

const classStyles = `
<style>
.tdesign-demo__select-input-ul-borderless {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tdesign-demo__select-input-ul-borderless > li {
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

.tdesign-demo__select-input-ul-borderless > li:hover {
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

  onOptionClick = (item: { label: string; value: number }) => {
    this.selectValue.value = item;
    // 选中后立即关闭浮层
    this.popupVisible.value = false;
  };

  onClear = () => {
    this.selectValue.value = undefined;
  };

  onPopupVisibleChange: SelectInputProps['onPopupVisibleChange'] = (val, context) => {
    console.log(context);
    this.popupVisible.value = val;
  };

  installed(): void {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }

  render() {
    return (
      <div style={{ width: '60%' }}>
        {/* <!-- :popup-props="{ trigger: 'hover' }" --> */}
        <t-select-input
          value={this.selectValue.value}
          popupVisible={this.popupVisible.value}
          placeholder="Please Select"
          borderless
          clearable
          onPopupVisibleChange={this.onPopupVisibleChange}
          onClear={this.onClear}
          panel={
            <ul className="tdesign-demo__select-input-ul-borderless">
              {OPTIONS.map((item) => (
                <li key={item.value} onClick={() => this.onOptionClick(item)}>
                  {item.label}
                </li>
              ))}
            </ul>
          }
          suffixIcon={<t-icon-chevron-down />}
        ></t-select-input>
      </div>
    );
  }
}
