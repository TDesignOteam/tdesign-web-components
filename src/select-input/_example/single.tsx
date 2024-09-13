import 'tdesign-web-components/select-input';
import 'tdesign-icons-web-components/esm/components/chevron-down';

import { Component, signal } from 'omi';

const classStyles = `
.tdesign-demo__select-input-ul-single {
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 2px;
}
.tdesign-demo__select-input-ul-single > li {
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

.tdesign-demo__select-input-ul-single > li:hover {
  background-color: var(--td-bg-color-container-hover);
}
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
  static css = classStyles;

  selectValue = signal({ label: 'tdesign-vue', value: 1 });

  popupVisible = signal(false);

  onOptionClick = (e: Event, item: { label: string; value: number }) => {
    e.stopPropagation();
    console.log('===item', item);
    this.selectValue.value = item;
    // 选中后立即关闭浮层
    this.popupVisible.value = false;
  };

  onClear = () => {
    this.selectValue.value = undefined;
  };

  onPopupVisibleChange = (val) => {
    this.popupVisible.value = val;
  };

  render() {
    return (
      <div>
        <t-select-input
          value={this.selectValue.value}
          popupVisible={this.popupVisible.value}
          style={{ width: '300px' }}
          placeholder="Please Select"
          clearable
          allowInput
          popupProps={{ overlayInnerStyle: { padding: 6 }, css: classStyles }}
          onPopupVisibleChange={this.onPopupVisibleChange}
          onClear={this.onClear}
          panel={
            <ul className="tdesign-demo__select-input-ul-single">
              {OPTIONS.map((item) => (
                <li key={item.value} onClick={(e) => this.onOptionClick(e, item)}>
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
