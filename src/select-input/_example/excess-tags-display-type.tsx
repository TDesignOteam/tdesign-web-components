import 'tdesign-web-components/select-input';
import 'tdesign-web-components/checkbox';

import { Component, signal } from 'omi';
import { CheckboxGroupChangeContext, CheckboxOptionObj } from 'tdesign-web-components/checkbox';
import { TagInputChangeContext, TagInputValue } from 'tdesign-web-components/tag-input';

const classStyles = `
<style>
.tdesign-demo__panel-options-excess-tags-display-type {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tdesign-demo__panel-options-excess-tags-display-type .t-checkbox {
  display: flex;
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
  margin-right: 0;
}

.tdesign-demo__panel-options-excess-tags-display-type .t-checkbox:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>
`;

const OPTIONS: CheckboxOptionObj[] = [
  // 全选
  { label: 'Check All', checkAll: true },
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: 4 },
  { label: 'tdesign-mobile-vue', value: 5 },
  { label: 'tdesign-mobile-react', value: 6 },
];

export default class SelectInputExcessTagsDisplayType extends Component {
  options = signal([...OPTIONS]);

  value = signal(OPTIONS.slice(1));

  checkboxValue = (() => {
    const arr = [];
    const list = this.value.value;
    // 此处不使用 forEach，减少函数迭代
    for (let i = 0, len = list.length; i < len; i++) {
      list[i].value && arr.push(list[i].value);
    }
    return arr;
  })();

  // 直接 checkboxgroup 组件渲染输出下拉选项，自定义处理可以避免顺序和 tagChange 冲突
  onCheckedChange = (val: any, { current, type }: CheckboxGroupChangeContext) => {
    // current 不存在，则表示操作全选
    if (!current) {
      const newValue = type === 'check' ? this.options.value.slice(1) : [];
      this.value.value = newValue;
      return;
    }
    // 普通操作
    if (type === 'check') {
      const option = this.options.value.find((t) => t.value === current);
      this.value.value = this.value.value.concat(option);
    } else {
      const newValue = this.value.value.filter((v) => v.value !== current);
      this.value.value = newValue;
    }
  };

  // 可以根据触发来源，自由定制标签变化时的筛选器行为
  onTagChange = (currentTags: TagInputValue, context: TagInputChangeContext) => {
    const { trigger, index, item } = context;
    if (trigger === 'clear') {
      this.value.value = [];
    }
    if (['tag-remove', 'backspace'].includes(trigger)) {
      const newValue = [...this.value.value];
      newValue.splice(index, 1);
      this.value.value = newValue;
    }
    // 如果允许创建新条目
    if (trigger === 'enter') {
      const current = { label: item, value: item };
      const newValue = [...this.value.value];
      this.value.value = newValue.concat(current);
      this.options.value = this.options.value.concat(current);
    }
  };

  installed(): void {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }

  render() {
    return (
      <div className="tdesign-demo__select-input-excess-tags-display-type" style={{ width: 'width: 100%' }}>
        {/* <!-- excessTagsDisplayType: 'scroll'，超出时，滚动显示 --> */}
        <p>第一种呈现方式：超出时滚动显示</p>
        <br />
        <t-select-input
          value={this.value.value}
          tagInputProps={{ excessTagsDisplayType: 'scroll' }}
          placeholder="请选择"
          allowInput
          clearable
          multiple
          onTagChange={this.onTagChange}
          panel={
            <t-checkbox-group
              value={this.checkboxValue}
              options={this.options.value}
              className="tdesign-demo__panel-options-excess-tags-display-type"
              onChange={this.onCheckedChange}
            />
          }
        />

        <br />
        <br />
        <br />

        {/* <!-- excessTagsDisplayType: 'scroll'，超出时，换行显示 --> */}
        <p>第二种呈现方式：超出时换行显示</p>
        <br />
        <t-select-input
          value={this.value.value}
          tagInputProps={{ excessTagsDisplayType: 'break-line' }}
          placeholder="请选择"
          allowInput
          clearable
          multiple
          onTagChange={this.onTagChange}
          panel={
            <t-checkbox-group
              value={this.checkboxValue}
              options={this.options.value}
              className="tdesign-demo__panel-options-excess-tags-display-type"
              onChange={this.onCheckedChange}
            />
          }
        />
      </div>
    );
  }
}
