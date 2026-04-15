import 'tdesign-web-components/select-input';
import 'tdesign-web-components/checkbox';
import 'tdesign-web-components/radio';
import 'tdesign-icons-web-components/esm/components/chevron-down';

import { Component, signal } from 'omi';
import type { CheckboxGroupProps, CheckboxOptionObj, SelectInputProps } from 'tdesign-web-components';

const classStyles = `
.tdesign-demo__panel-options-multiple {
  width: 100%;
  padding: 0 !important;
  display: flex !important;
  flex-direction: column;
  gap: 2px !important;
}
.tdesign-demo__panel-options-multiple .t-checkbox {
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
  margin: 0;
}
.tdesign-demo__panel-options-multiple .t-checkbox:hover {
  background-color: var(--td-bg-color-container-hover);
}
`;

const OPTIONS: CheckboxOptionObj[] = [
  // 全选
  { label: 'Check All', checkAll: true, isLightDom: true },
  { label: 'tdesign-vue', value: 1, isLightDom: true },
  { label: 'tdesign-react', value: 2, isLightDom: true },
  { label: 'tdesign-miniprogram', value: 3, isLightDom: true },
  { label: 'tdesign-angular', value: 4, isLightDom: true },
  { label: 'tdesign-mobile-vue', value: 5, isLightDom: true },
  { label: 'tdesign-mobile-react', value: 6, isLightDom: true },
];

type ExcessTagsDisplayType = SelectInputProps['tagInputProps']['excessTagsDisplayType'];

export default class SelectInputMultiple extends Component {
  excessTagsDisplayType = signal<ExcessTagsDisplayType>('break-line');

  allowInput = signal(true);

  creatable = signal(true);

  inputValue = signal('');

  // 全量数据
  options = signal([...OPTIONS]);

  // 仅用作展示的数据（过滤功能需要使用）
  displayOptions = signal([...OPTIONS]);

  value = signal<Array<any>>([
    { label: 'Vue', value: 1 },
    { label: 'React', value: 2 },
    { label: 'Miniprogram', value: 3 },
  ]);

  getCheckboxValue = () => {
    const arr = [];
    const list = this.value.value;
    // 此处不使用 forEach，减少函数迭代
    for (let i = 0, len = list.length; i < len; i++) {
      list[i].value && arr.push(list[i].value);
    }
    return arr;
  };

  // 直接 checkboxgroup 组件渲染输出下拉选项，自定义处理可以避免顺序和 tagChange 冲突
  onCheckedChange: CheckboxGroupProps['onChange'] = (val, { current, type }) => {
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
  onTagChange: SelectInputProps['onTagChange'] = (currentTags, context) => {
    const { trigger, index } = context;
    if (trigger === 'clear') {
      this.value.value = [];
    }
    if (['tag-remove', 'backspace'].includes(trigger)) {
      const newValue = [...this.value.value];
      newValue.splice(index, 1);
      this.value.value = newValue;
    }
  };

  onInputChange: SelectInputProps['onInputChange'] = (val, context) => {
    this.inputValue.value = val;
    // 过滤功能
    console.log(val, context);
  };

  onInputEnter: SelectInputProps['onEnter'] = (_, { inputValue }) => {
    // 如果允许创建新条目
    if (this.creatable.value) {
      const current = { label: inputValue, value: inputValue };
      const newValue = [...this.value.value];
      this.value.value = newValue.concat(current);
      const newOptions = this.options.value.concat(current);
      this.options.value = newOptions;
      this.displayOptions.value = newOptions;
      this.inputValue.value = '';
    }
  };

  render() {
    const checkboxValue = this.getCheckboxValue();
    return (
      <div className="tdesign-demo__select-input-multiple" style={{ width: '100%' }}>
        <div>
          <t-checkbox
            checked={this.allowInput.value}
            onChange={(v) => {
              this.allowInput.value = v;
            }}
          >
            是否允许输入
          </t-checkbox>
          <t-checkbox
            checked={this.creatable.value}
            onChange={(v) => {
              this.creatable.value = v;
            }}
          >
            允许创建新选项（Enter 创建）
          </t-checkbox>
        </div>
        <br />
        <div>
          <t-radio-group
            value={this.excessTagsDisplayType.value}
            onChange={(val: ExcessTagsDisplayType) => (this.excessTagsDisplayType.value = val)}
            options={[
              { label: '选中项过多横向滚动', value: 'scroll' },
              { label: '选中项过多换行显示', value: 'break-line' },
            ]}
          />
        </div>
        <br />
        <br />

        {/* <!-- :popup-props="{ trigger: 'hover' }" --> */}
        <t-select-input
          value={this.value.value}
          allowInput={this.allowInput.value}
          inputValue={this.inputValue.value}
          placeholder={this.allowInput.value ? '请选择或输入' : '请选择'}
          tagInputProps={{ excessTagsDisplayType: this.excessTagsDisplayType.value }}
          popupProps={{ overlayStyle: { maxHeight: '280px', overflow: 'auto' } }}
          // label={<span>多选：</span>}
          panel={
            this.displayOptions.value.length ? (
              <t-checkbox-group
                css={classStyles}
                value={checkboxValue}
                options={this.displayOptions.value}
                className="tdesign-demo__panel-options-multiple"
                onChange={this.onCheckedChange}
              />
            ) : (
              <div className="tdesign-demo__select-empty-multiple">暂无数据</div>
            )
          }
          suffixIcon={<t-icon-chevron-down />}
          clearable
          multiple
          onTagChange={this.onTagChange}
          onInputChange={this.onInputChange}
          onEnter={this.onInputEnter}
        />
      </div>
    );
  }
}
