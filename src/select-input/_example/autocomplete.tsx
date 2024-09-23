import 'tdesign-web-components/select-input';
import 'tdesign-icons-web-components/esm/components/search';

import { Component, signal } from 'omi';

const classStyles = `
<style>
.tdesign-demo__select-input-ul-autocomplete {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tdesign-demo__select-input-ul-autocomplete > li {
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

.tdesign-demo__select-input-ul-autocomplete > li:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>
`;

const OPTIONS = ['Student A', 'Student B', 'Student C', 'Student D', 'Student E', 'Student F'];

export default class SelectInputAutocomplete extends Component {
  popupVisible = signal(false);

  selectValue = '';

  options = OPTIONS;

  onOptionClick = (item: string) => {
    this.selectValue = item;
    this.popupVisible.value = false;
  };

  onInputChange = (keyword: string) => {
    console.log('===keyword', keyword);
    this.selectValue = keyword;
    // const options = new Array(5).fill(null).map((t, index) => `${keyword} Student ${index}`);
    // this.options = options;
    setTimeout(() => this.update(), 1000);
  };

  onPopupVisibleChange = (val: boolean) => {
    this.popupVisible.value = val;
  };

  installed(): void {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }

  // 如果需要输入框宽度自适应，可以使用 autoWidth
  render() {
    return (
      <div>
        <t-select-input
          value={this.selectValue}
          popupVisible={this.popupVisible.value}
          placeholder="请输入任意关键词"
          allowInput
          clearable
          style={{ width: '300px' }}
          onInputChange={this.onInputChange}
          onPopupVisibleChange={this.onPopupVisibleChange}
          panel={
            <ul className="tdesign-demo__select-input-ul-autocomplete">
              {this.options.map((item) => (
                <li key={item} onClick={() => this.onOptionClick(item)}>
                  {item}
                </li>
              ))}
            </ul>
          }
          suffixIcon={<t-icon-search />}
        />
      </div>
    );
  }
}
