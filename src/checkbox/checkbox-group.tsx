import { intersection, isObject, isString, isUndefined, toArray } from 'lodash';
import { bind, Component, signal, tag, VNode } from 'omi';

import classname, { getClassPrefix } from '../_util/classname.ts';
import { convertToLightDomNode } from '../_util/lightDom.ts';
import { StyledProps, TNode } from '../common';
import { CheckboxContextKey } from './checkbox';
import {
  CheckboxGroupChangeContext,
  CheckboxGroupValue,
  CheckboxOptionObj,
  TdCheckboxGroupProps,
  TdCheckboxProps,
} from './type';

export interface CheckboxGroupProps<T extends CheckboxGroupValue = CheckboxGroupValue>
  extends TdCheckboxGroupProps<T>,
    StyledProps {
  children?: TNode;
}

@tag('t-checkbox-group')
export default class CheckboxGroup extends Component<CheckboxGroupProps> {
  static propTypes = {
    disabled: Boolean,
    max: Number,
    options: Array,
    value: Array,
    defaultValue: Array,
    readonly: Boolean,
    onChange: Function,
  };

  innerValue = signal<CheckboxGroupValue>([]);

  innerOptionList = signal<CheckboxOptionObj[]>([]);

  get tChecked() {
    return this.props.value ?? this.innerValue.value;
  }

  get isControlled() {
    const { value } = this.props;
    return typeof value !== 'undefined';
  }

  get optionList(): CheckboxOptionObj[] {
    if (!this.props.options) return this.innerOptionList.value;
    return this.props.options.map((item) => (isObject(item) ? item : { label: String(item), value: item }));
  }

  get intersectionLen() {
    if (!Array.isArray(this.tChecked)) return 0;
    const values = this.optionList.map((item) => item.value);
    const n = intersection(this.tChecked, values);
    return n.length;
  }

  get isCheckAll() {
    const optionItems = this.optionList
      .filter((item) => !item.disabled && !item.readonly && !item.checkAll)
      .map((t) => t.value);

    // 计算当前选中值与筛选后的选项值的交集
    const intersectionValues = intersection(optionItems, this.tChecked);

    return intersectionValues.length === optionItems.length;
  }

  get indeterminate() {
    return !this.isCheckAll && this.intersectionLen < this.optionList.length && this.intersectionLen !== 0;
  }

  get maxExceeded() {
    return !isUndefined(this.props.max) && this.tChecked.length === this.props.max;
  }

  setInnerValue(value: CheckboxGroupValue, context: CheckboxGroupChangeContext) {
    this.innerValue.value = value;
    this.props.onChange?.(value, context);
  }

  @bind
  handleCheckboxChange(data: { checked: boolean; e: Event; option: TdCheckboxProps }) {
    const currentValue = data.option.value;
    if (!Array.isArray(this.tChecked)) {
      console.warn(`TDesign CheckboxGroup Warn: \`value\` must be an array, instead of ${typeof this.tChecked}`);
      return;
    }
    const val = [...this.tChecked];
    if (data.checked) {
      val.push(currentValue);
    } else {
      const i = val.indexOf(currentValue);
      val.splice(i, 1);
    }
    this.setInnerValue(val, {
      e: data.e,
      current: data.option.value,
      option: data.option,
      type: data.checked ? 'check' : 'uncheck',
    });
  }

  getAllCheckboxValue(): CheckboxGroupValue {
    const val = new Set<TdCheckboxProps['value']>();

    // 遍历选项列表，忽略特定状态的项，并收集有效值
    for (let i = 0, len = this.optionList.length; i < len; i++) {
      const item = this.optionList[i];

      // 如果项被标记为检查所有、禁用或只读，则跳过当前循环迭代
      if (item.checkAll) continue;
      if (item.disabled) continue;
      if (item.readonly) continue;

      val.add(item.value); // 添加非排除状态项的值到集合中

      // 如果已达到最大限制，则终止循环
      if (this.maxExceeded) break;
    }

    return [...val]; // 从 Set 集合转换为数组并返回
  }

  @bind
  onCheckAllChange(checked: boolean, context: { e: Event; source?: 't-checkbox' }) {
    const value: CheckboxGroupValue = checked ? this.getAllCheckboxValue() : [];
    this.setInnerValue(value, {
      e: context.e,
      type: checked ? 'check' : 'uncheck',
      current: undefined,
      option: undefined,
    });
  }

  @bind
  onCheckedChange(p: { checked: boolean; checkAll: boolean; e: Event; option: TdCheckboxProps }) {
    const { checked, checkAll, e } = p;
    if (checkAll) {
      this.onCheckAllChange(checked, { e });
    } else {
      this.handleCheckboxChange(p);
    }
  }

  getOptionListBySlots() {
    // eslint-disable-next-line array-callback-return
    const nodes: VNode[] = toArray(this.props.children).filter((node: VNode) => {
      isString(node.nodeName) && node.nodeName.endsWith('checkbox');
    });
    const arr: Array<CheckboxOptionObj> = [];
    nodes?.forEach((node) => {
      const option = node.attributes as CheckboxOptionObj;
      arr.push(option);
    });
    return arr;
  }

  provide = {
    [CheckboxContextKey]: () => ({
      isCheckAll: this.isCheckAll,
      checkedValues: this.tChecked || [],
      maxExceeded: this.maxExceeded,
      disabled: this.props.disabled,
      readonly: this.props.readonly,
      indeterminate: this.indeterminate,
      handleCheckboxChange: this.handleCheckboxChange,
      onCheckedChange: this.onCheckedChange,
    }),
  };

  install() {
    const { value, defaultValue } = this.props;
    if (this.isControlled) {
      this.innerValue.value = value;
    } else if (typeof defaultValue !== 'undefined') {
      this.innerValue.value = defaultValue;
    }
  }

  render() {
    const classPrefix = getClassPrefix();
    let children = null;
    if (this.props.options?.length) {
      children = this.optionList?.map((option, index) => {
        const { isLightDom, ...rest } = option;
        const checkbox = (
          <t-checkbox
            key={`${option.value || ''}${index}`}
            {...rest}
            index={index}
            checked={this.tChecked?.includes(option.value)}
            data={option}
          ></t-checkbox>
        );
        if (isLightDom) {
          return convertToLightDomNode(checkbox);
        }
        return checkbox;
      });
    } else {
      this.innerOptionList.value = this.getOptionListBySlots();
      children = this.props.children;
    }

    return (
      <div
        class={classname(`${classPrefix}-checkbox-group`, this.props.innerClass)}
        style={this.props.innerStyle}
        role="group"
        aria-label="checkbox-group"
      >
        {children}
      </div>
    );
  }
}
