import '../tag-input';

import classNames from 'classnames';
import isObject from 'lodash/isObject';
import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import useControlled from '../_util/useControlled';
import { TagInputValue } from '../tag-input';
import { SelectInputCommonProperties } from './interface';
import { SelectInputChangeContext, SelectInputKeys, SelectInputValue, TdSelectInputProps } from './type';

export interface RenderSelectMultipleParams {
  commonInputProps: SelectInputCommonProperties;
  onInnerClear: (context: { e: MouseEvent }) => void;
  popupVisible: boolean;
  allowInput: boolean;
}

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
  children: 'children',
};

@tag('t-select-input-multiple')
export default class SelectInputMultiple extends Component<TdSelectInputProps> {
  classPrefix = getClassPrefix();

  tagInputRef = createRef();

  render(props) {
    const { value, popupVisible, commonInputProps, allowInput } = props;
    const [tInputValue, setTInputValue] = useControlled(props, 'inputValue', props.onInputChange);
    const iKeys: SelectInputKeys = { ...DEFAULT_KEYS, ...props.keys };

    const getTags = () => {
      if (!(value instanceof Array)) {
        return isObject(value) ? [value[iKeys.label]] : [value];
      }
      return value.map((item: SelectInputValue) => (isObject(item) ? item[iKeys.label] : item));
    };
    const tags = getTags();

    const tPlaceholder = !tags || !tags.length ? props.placeholder : '';

    const onTagInputChange = (val: TagInputValue, context: SelectInputChangeContext) => {
      // 避免触发浮层的显示或隐藏
      if (context.trigger === 'tag-remove') {
        context.e?.stopPropagation();
      }
      props.onTagChange?.(val, context);
    };

    const onInnerClear = (context: { e: MouseEvent }) => {
      console.log('====cle');
      context?.e?.stopPropagation();
      props.onClear?.(context);
      setTInputValue('', { trigger: 'clear' });
    };

    return (
      <t-tag-input
        ref={this.tagInputRef}
        {...commonInputProps}
        autoWidth={props.autoWidth}
        readonly={props.readonly}
        minCollapsedNum={props.minCollapsedNum}
        collapsedItems={props.collapsedItems}
        tag={props.tag}
        valueDisplay={props.valueDisplay}
        placeholder={tPlaceholder}
        value={tags}
        inputValue={popupVisible && allowInput ? tInputValue : ''}
        onChange={onTagInputChange}
        onInputChange={(val, context) => {
          // 筛选器统一特性：筛选器按下回车时不清空输入框
          if (context?.trigger === 'enter' || context?.trigger === 'blur') return;
          setTInputValue(val, { trigger: context.trigger, e: context.e });
        }}
        tagProps={props.tagProps}
        onClear={onInnerClear}
        // [Important Info]: SelectInput.blur is not equal to TagInput, example: click popup panel
        onFocus={(val, context) => {
          props.onFocus?.(props.value, { ...context, tagInputValue: val });
        }}
        onBlur={!props.panel ? props.onBlur : null}
        {...props.tagInputProps}
        inputProps={{
          ...props.inputProps,
          readonly: !props.allowInput || props.readonly,
          inputClass: classNames(props.tagInputProps?.className, {
            [`${this.classPrefix}-input--focused`]: popupVisible,
            [`${this.classPrefix}-is-focused`]: popupVisible,
          }),
        }}
      />
    );
  }
}
