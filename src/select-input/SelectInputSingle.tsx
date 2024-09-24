import '../input';

import classNames from 'classnames';
import isObject from 'lodash/isObject';
import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
// import useControlled from '../_util/useControlled';
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
export default class SingleSelectInput extends Component<
  TdSelectInputProps & { onUpdateValue: (val: TdSelectInputProps['inputValue'], key: string) => void }
> {
  static css = [
    `:host {
      width: 100%;
    };
    `,
  ];

  classPrefix = getClassPrefix();

  inputRef = createRef();

  inputValue;

  setInputValue;

  install(): void {
    this.inputValue = this.props.inputValue || this.props.defaultInputValue;
  }

  onInnerClear = (context: { e: MouseEvent }) => {
    context?.e?.stopPropagation();
    this.props.onClear?.(context);
    this.inputValue = '';
    this.props?.onInputChange?.('', { trigger: 'clear' });
    this.props.onUpdateValue('', 'singleInputValue');
  };

  onInnerInputChange: TdInputProps['onChange'] = (value, context) => {
    if (this.props.allowInput) {
      this.inputValue = value;
      this.props?.onInputChange?.(value, { ...context, trigger: 'input' });
      this.props.onUpdateValue(value, 'singleInputValue');
    }
  };

  handleEmptyPanelBlur = (value: string, { e }: { e: FocusEvent }) => {
    this.props.onBlur?.(value, { e, inputValue: value });
  };

  render(props) {
    const { value, keys, commonInputProps, popupVisible, borderless } = props;

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
        onChange={this.onInnerInputChange}
        readonly={!props.allowInput}
        onClear={this.onInnerClear}
        // [Important Info]: SelectInput.blur is not equal to Input, example: click popup panel
        onFocus={(val, context) => {
          props.onFocus?.(value, { ...context, inputValue: val });
          // focus might not need to change input value. it will caught some curious errors in tree-select
          // !popupVisible && setInputValue(getInputValue(value, keys), { ...context, trigger: 'input' });
        }}
        onEnter={(val, context) => {
          props.onEnter?.(value, { ...context, inputValue: val });
        }}
        // onBlur need to triggered by input when popup panel is null
        onBlur={!props.panel ? this.handleEmptyPanelBlur : null}
        borderless={borderless}
        {...props.inputProps}
        inputClass={classNames(props.inputProps?.className, {
          [`${this.classPrefix}-input--focused`]: popupVisible,
          [`${this.classPrefix}-is-focused`]: popupVisible,
        })}
      />
    );
  }
}
