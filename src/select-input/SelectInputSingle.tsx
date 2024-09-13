import '../input';

import classNames from 'classnames';
import isObject from 'lodash/isObject';
import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import useControlled from '../_util/useControlled';
import { TdInputProps } from '../input';
import { TdSelectInputProps } from './type';

export interface RenderSelectSingleInputParams {
  tPlaceholder: string;
}

const DEFAULT_KEYS: TdSelectInputProps['keys'] = {
  label: 'label',
  value: 'value',
};

function getInputValue(value: TdSelectInputProps['value'], keys: TdSelectInputProps['keys']) {
  const iKeys = keys || DEFAULT_KEYS;
  return isObject(value) ? value[iKeys.label] : value;
}

@tag('t-select-input-single')
export default class SingleSelectInput extends Component<TdSelectInputProps> {
  classPrefix = getClassPrefix();

  inputRef = createRef();

  inputValue;

  setInputValue;

  install(): void {
    const [inputValue, setInputValue] = useControlled(this.props, 'inputValue', this.props.onInputChange);
    this.inputValue = inputValue;
    this.setInputValue = setInputValue;
  }

  render(props) {
    const { value, keys, commonInputProps, popupVisible } = props;

    const onInnerClear = (context: { e: MouseEvent }) => {
      console.log('---fff');
      context?.e?.stopPropagation();
      props.onClear?.(context);
      this.setInputValue('', { trigger: 'clear' });
    };

    const onInnerInputChange: TdInputProps['onChange'] = (value, context) => {
      if (props.allowInput) {
        this.setInputValue(value, { ...context, trigger: 'input' });
      }
    };

    const handleEmptyPanelBlur = (value: string, { e }: { e: FocusEvent }) => {
      props.onBlur?.(value, { e, inputValue: value });
    };

    // 单选，值的呈现方式
    const singleValueDisplay = !props.multiple ? props.valueDisplay : null;
    const displayedValue = popupVisible && props.allowInput ? this.inputValue : getInputValue(value, keys);
    return (
      <t-input
        ref={this.inputRef}
        {...commonInputProps}
        autoWidth={props.autoWidth}
        placeholder={singleValueDisplay ? '' : props.placeholder}
        value={singleValueDisplay ? ' ' : displayedValue}
        label={
          <>
            {props.label}
            {singleValueDisplay}
          </>
        }
        onChange={onInnerInputChange}
        readonly={!props.allowInput}
        onClear={onInnerClear}
        // [Important Info]: SelectInput.blur is not equal to Input, example: click popup panel
        onFocus={(val, context) => {
          console.log('focus');
          props.onFocus?.(value, { ...context, inputValue: val });
          // focus might not need to change input value. it will caught some curious errors in tree-select
          // !popupVisible && setInputValue(getInputValue(value, keys), { ...context, trigger: 'input' });
        }}
        onEnter={(val, context) => {
          props.onEnter?.(value, { ...context, inputValue: val });
        }}
        // onBlur need to triggered by input when popup panel is null
        onBlur={!props.panel ? handleEmptyPanelBlur : null}
        {...props.inputProps}
        inputClass={classNames(props.inputProps?.className, {
          [`${this.classPrefix}-input--focused`]: popupVisible,
          [`${this.classPrefix}-is-focused`]: popupVisible,
        })}
      />
    );
  }
}
