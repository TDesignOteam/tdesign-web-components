import '../tag-input';

import classNames from 'classnames';
import { isObject } from 'lodash-es';
import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
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

const classPrefix = getClassPrefix();

const autoWidthCss = `
.${classPrefix}-input--auto-width.${classPrefix}-tag-input__with-suffix-icon.${classPrefix}-tag-input--with-tag .${classPrefix}-input {
  padding-right: var(--td-comp-paddingLR-xl);
};
`;
@tag('t-select-input-multiple')
export default class SelectInputMultiple extends Component<
  TdSelectInputProps & { onUpdateValue: (val: TdSelectInputProps['inputValue'], key: string) => void }
> {
  static css = [
    `:host {
      width: 100%;
    };
    `,
  ];

  classPrefix = classPrefix;

  tagInputRef = createRef();

  tInputValue;

  install(): void {
    this.tInputValue = this.props.inputValue || this.props.defaultInputValue;
  }

  ready(): void {
    // autoWidth时，:host宽度需要自适应
    if (this.props.autoWidth) {
      (this as any).style.width = 'fit-content';
    }
  }

  onTagInputChange = (val: TagInputValue, context: SelectInputChangeContext) => {
    // 避免触发浮层的显示或隐藏
    if (context.trigger === 'tag-remove') {
      context.e?.stopPropagation();
    }
    this.props.onTagChange?.(val, context);
  };

  onInnerClear = (context: { e: MouseEvent }) => {
    context?.e?.stopPropagation();
    this.props.onClear?.(context);
    this.tInputValue = '';
    this.props?.onInputChange?.('', { trigger: 'clear' });
    this.props.onUpdateValue('', 'multipleInputValue');
  };

  receiveProps(newProps: TdSelectInputProps, oldProps: TdSelectInputProps) {
    if (newProps.inputValue !== this.tInputValue) {
      this.tInputValue = newProps.inputValue;
    }
    // autoWidth变化时更新:host宽度
    if (newProps.autoWidth !== oldProps.autoWidth) {
      (this as any).style.width = newProps.autoWidth ? 'fit-content' : '100%';
    }
  }

  render(props) {
    const { value, popupVisible, commonInputProps, allowInput, borderless, autoWidth } = props;
    const iKeys: SelectInputKeys = { ...DEFAULT_KEYS, ...props.keys };

    const getTags = () => {
      if (!(value instanceof Array)) {
        return isObject(value) ? [value[iKeys.label]] : [value];
      }
      return value.map((item: SelectInputValue) => (isObject(item) ? item[iKeys.label] : item));
    };
    const tags = getTags();

    const tPlaceholder = !tags || !tags.length ? props.placeholder : '';

    const inputCss = (props?.inputProps?.css || '') + (autoWidth ? autoWidthCss : '');

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
        inputValue={popupVisible && allowInput ? this.tInputValue : ''}
        onChange={this.onTagInputChange}
        onInputChange={(val, context) => {
          // 筛选器统一特性：筛选器按下回车时不清空输入框
          if (context?.trigger === 'enter' || context?.trigger === 'blur') return;
          this.tInputValue = val;
          props?.onInputChange?.(val, { trigger: context.trigger, e: context.e });
          this.props.onUpdateValue(val, 'multipleInputValue');
        }}
        tagProps={props.tagProps}
        onClear={this.onInnerClear}
        // [Important Info]: SelectInput.blur is not equal to TagInput, example: click popup panel
        onFocus={(val, context) => {
          props.onFocus?.(props.value, { ...context, tagInputValue: val });
        }}
        onBlur={!props.panel ? props.onBlur : null}
        style={{ width: '100%', display: 'inline-flex' }}
        borderless={borderless}
        {...props.tagInputProps}
        inputProps={{
          ...props.inputProps,
          readonly: !props.allowInput || props.readonly,
          inputClass: classNames(props.tagInputProps?.className, {
            [`${this.classPrefix}-input--focused`]: popupVisible,
            [`${this.classPrefix}-is-focused`]: popupVisible,
          }),
          css: inputCss,
        }}
      />
    );
  }
}
