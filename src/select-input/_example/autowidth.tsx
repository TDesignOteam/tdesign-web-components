import 'tdesign-web-components/select-input';
import 'tdesign-icons-web-components/esm/components/chevron-down';

import { Component, signal } from 'omi';
import { SelectInputValueChangeContext } from 'tdesign-web-components/select-input';

const classStyles = `
<style>
.tdesign-demo__select-input-ul-auto-width {
  padding: 2px 0;
  margin: 0 -2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tdesign-demo__select-input-ul-auto-width > li {
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

.tdesign-demo__select-input-ul-auto-width > li:hover {
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

export default class SelectInputAutocomplete extends Component {
  popupVisible = signal(false);

  selectValue = signal({ label: 'tdesign-vue', value: 1 });

  onOptionClick = (item: { label: string; value: number }) => {
    this.selectValue.value = item;
    this.popupVisible.value = false;
  };

  onClear = () => {
    this.selectValue.value = undefined;
  };

  onPopupVisibleChange = (val: boolean) => {
    this.popupVisible.value = val;
  };

  onInputChange = (val: string, context: SelectInputValueChangeContext) => {
    // 过滤功能
    console.log(val, context);
  };

  installed(): void {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }

  render() {
    // 如果需要输入框宽度自适应，可以使用 autoWidth
    return (
      <t-select-input
        value={this.selectValue.value}
        popupVisible={this.popupVisible.value}
        placeholder="Please Select"
        clearable
        autoWidth
        allowInput
        onPopupVisibleChange={this.onPopupVisibleChange}
        onClear={this.onClear}
        onInputChange={this.onInputChange}
        suffixIcon={<t-chevron-down />}
        panel={
          <ul className="tdesign-demo__select-input-ul-auto-width">
            {OPTIONS.map((item) => (
              <li key={item.value} onClick={() => this.onOptionClick(item)}>
                {item.label}
              </li>
            ))}
          </ul>
        }
      />
    );
  }
}
