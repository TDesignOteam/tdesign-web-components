import 'tdesign-web-components/select-input';
import 'tdesign-icons-web-components/esm/components/control-platform';
import 'tdesign-web-components/tag';

import { Component, signal } from 'omi';

const classStyles = `
<style>
.tdesign-demo__select-input-ul-single {
  padding: 0;
  display: flex;
  flex-direction: column;
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

.tdesign-demo__select-empty-custom {
  text-align: center;
  color: var(--td-text-color-disabled);
  line-height: 32px;
}
</style>
`;

const inputStyles = `
<style>
.displaySpan {
  line-height: 24px;
  display: flex;
  align-items: center;
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

export default class SelectInputCustomTag extends Component {
  selectValue1 = signal({ label: 'tdesign-vue', value: 1 });

  selectValue2 = signal(['tdesign-vue', 'tdesign-react']);

  selectValue3 = signal(['tdesign-vue', 'tdesign-react', 'tdesign-mobile-vue']);

  onOptionClick = (item: { label: string; value: number }) => {
    this.selectValue1.value = item;
  };

  onClear = () => {
    this.selectValue1.value = undefined;
  };

  onTagChange2 = (val: string[]) => {
    this.selectValue2.value = val;
  };

  onTagChange3 = (val: string[]) => {
    this.selectValue3.value = val;
  };

  install() {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }

  render() {
    return (
      <div className="tdesign-demo-select-input-custom-tag">
        {/* <!-- 单选，使用 valueDisplay 定义选中的某一项的内容 --> */}
        <t-select-input
          value={this.selectValue1.value}
          placeholder="Please Select"
          clearable
          inputProps={{ css: inputStyles }}
          valueDisplay={
            this.selectValue1.value && (
              <span className="displaySpan">
                <t-icon-control-platform style={{ fontSize: '16px', marginRight: 4, verticalAlign: 'sub' }} />
                {this.selectValue1.value.label}
              </span>
            )
          }
          panel={
            <ul className="tdesign-demo__select-input-ul-single">
              {OPTIONS.map((item) => (
                <li key={item.value} onClick={() => this.onOptionClick(item)}>
                  {item.label}
                </li>
              ))}
            </ul>
          }
          onClear={this.onClear}
        />

        <br />
        <br />

        {/* <!-- 多选，第一种方式：使用 tag 定义选中的某一项的内容 --> */}
        <t-select-input
          value={this.selectValue2.value}
          placeholder="Please Select"
          multiple
          inputProps={{ css: inputStyles }}
          tag={({ value }) => (
            <span className="displaySpan">
              <t-icon-control-platform style={{ fontSize: '16px', marginRight: 4, verticalAlign: 'sub' }} /> {value}
            </span>
          )}
          panel={<div className="tdesign-demo__select-empty-custom">暂无示意数据</div>}
          onTagChange={this.onTagChange2}
        />

        <br />
        <br />

        {/* <!-- 多选，第二种方式：使用 valueDisplay 定义全部选中项的内容 --> */}
        <t-select-input
          value={this.selectValue3.value}
          placeholder="Please Select"
          multiple
          inputProps={{ css: inputStyles }}
          valueDisplay={({ value, onClose }) =>
            value.map((item, index) => (
              <t-tag
                part={`input-tag`}
                key={item}
                closable
                style={{ marginRight: '4px' }}
                onClose={() => onClose(index)}
              >
                <span className="displaySpan">
                  <t-icon-control-platform style={{ fontSize: '16px', marginRight: 4, verticalAlign: 'sub' }} /> {value}
                </span>
              </t-tag>
            ))
          }
          panel={<div className="tdesign-demo__select-empty-custom">暂无示意数据</div>}
          onTagChange={this.onTagChange3}
        />
      </div>
    );
  }
}
