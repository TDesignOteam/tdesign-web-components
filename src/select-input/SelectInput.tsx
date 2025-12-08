import '../loading';
import './SelectInputMultiple';
import './SelectInputSingle';
import '../popup';

import classNames from 'classnames';
import { pick } from 'lodash-es';
import { Component, createRef, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { setExportparts } from '../_util/dom';
import { StyledProps } from '../common';
import { PopupVisibleChangeContext } from '../popup';
import { selectInputDefaultProps } from './defaultProps';
import { SelectInputCommonProperties } from './interface';
import { TdSelectInputProps } from './type';
import useOverlayInnerStyle from './useOverlayInnerStyle';

export interface SelectInputProps extends TdSelectInputProps, StyledProps {
  updateScrollTop?: (content: HTMLDivElement) => void;
}

// single 和 multiple 共有特性
const COMMON_PROPERTIES = [
  'status',
  'clearable',
  'disabled',
  'label',
  'placeholder',
  'readonly',
  'suffix',
  'suffixIcon',
  'onPaste',
  'onEnter',
  'onMouseenter',
  'onMouseleave',
  'size',
  'prefixIcon',
];

const classPrefix = getClassPrefix();

@tag('t-select-input')
class SelectInput extends Component<SelectInputProps> {
  static css = [
    `.${classPrefix}-select-input > ${classPrefix}-popup {
      display: inline-flex;
      width: 100%;
    };`,
  ];

  static defaultProps = selectInputDefaultProps;

  static propTypes = {
    allowInput: Boolean,
    autoWidth: Boolean,
    autofocus: Boolean,
    borderless: Boolean,
    clearable: Boolean,
    collapsedItems: [Function, Object, String, Number],
    disabled: Boolean,
    inputProps: Object,
    inputValue: String,
    defaultInputValue: String,
    keys: Object,
    label: [Function, Object, String, Number],
    loading: Boolean,
    minCollapsedNum: Number,
    multiple: Boolean,
    panel: [Function, Object, String, Number],
    placeholder: String,
    popupMatchWidth: Boolean,
    popupProps: Object,
    popupVisible: Boolean,
    defaultPopupVisible: Boolean,
    prefixIcon: [Function, Object, String, Number],
    readonly: Boolean,
    reserveKeyword: Boolean,
    size: String,
    status: String,
    suffix: [Function, Object, String, Number],
    suffixIcon: [Function, Object, String, Number],
    tag: [String, Function, Object, Number],
    tagInputProps: Object,
    tagProps: Object,
    tips: [Function, Object, String, Number],
    value: [String, Number, Boolean, Object, Array],
    valueDisplay: [String, Function, Object, Number],
    onBlur: Function,
    onClear: Function,
    onEnter: Function,
    onFocus: Function,
    onInputChange: Function,
    onMouseenter: Function,
    onMouseleave: Function,
    onPaste: Function,
    onPopupVisibleChange: Function,
    onTagChange: Function,
  };

  selectInputRef = createRef();

  selectInputWrapRef = createRef();

  classPrefix = classPrefix;

  tOverlayInnerStyle;

  innerPopupVisible;

  onInnerPopupVisibleChange;

  multipleInputValue;

  singleInputValue;

  get commonInputProps(): SelectInputCommonProperties {
    const { loading, suffixIcon } = this.props;

    return {
      ...pick(this.props, COMMON_PROPERTIES),
      suffixIcon: loading ? <t-loading loading size="small" /> : suffixIcon,
    };
  }

  install(): void {
    const { innerPopupVisible, tOverlayInnerStyle, onInnerPopupVisibleChange } = useOverlayInnerStyle(
      this.props,
      {
        afterHidePopup: this.onInnerBlur.bind(this),
      },
      this,
    );
    this.tOverlayInnerStyle = tOverlayInnerStyle;
    this.innerPopupVisible = innerPopupVisible;
    this.onInnerPopupVisibleChange = onInnerPopupVisibleChange;

    if (this.props.multiple) {
      this.multipleInputValue = this.props.inputValue || this.props.defaultInputValue;
    } else {
      this.singleInputValue = this.props.inputValue || this.props.defaultInputValue;
    }
  }

  ready() {
    setExportparts(this);
  }

  updateValue = (val, key: 'multipleInputValue' | 'singleInputValue') => {
    this[key] = val;
  };

  onInnerBlur(ctx: PopupVisibleChangeContext) {
    const inputValue = this.props.multiple ? this.multipleInputValue : this.singleInputValue;
    const params: Parameters<TdSelectInputProps['onBlur']>[1] = { e: ctx.e, inputValue };
    this.props.onBlur?.(this.props.value, params);
  }

  render(props: SelectInputProps | OmiProps<SelectInputProps, any>) {
    const { multiple, value, popupVisible, popupProps, borderless, disabled } = props;

    // 浮层显示的受控与非受控
    const visibleProps = { visible: popupVisible ?? this.innerPopupVisible };

    const popupClasses = classNames(
      [
        `${this.classPrefix}-select-input`,
        {
          [`${this.classPrefix}-select-input--borderless`]: borderless,
          [`${this.classPrefix}-select-input--multiple`]: multiple,
          [`${this.classPrefix}-select-input--popup-visible`]: popupVisible ?? this.innerPopupVisible,
          [`${this.classPrefix}-select-input--empty`]: value instanceof Array ? !value.length : !value,
        },
      ],
      !props.tips ? props.innerClass : '',
    );

    const mainContent = (
      <div className={popupClasses} style={!props.tips ? props.innerStyle : {}}>
        <t-popup
          trigger={popupProps?.trigger || 'click'}
          placement="bottom-left"
          content={props.panel}
          hideEmptyPopup={true}
          onVisibleChange={this.onInnerPopupVisibleChange}
          updateScrollTop={props.updateScrollTop}
          {...visibleProps}
          {...popupProps}
          disabled={disabled}
          overlayInnerStyle={this.tOverlayInnerStyle()}
        >
          {multiple ? (
            <t-select-input-multiple
              {...props}
              commonInputProps={this.commonInputProps}
              popupVisible={visibleProps.visible}
              onUpdateValue={this.updateValue}
            />
          ) : (
            <t-select-input-single
              {...props}
              commonInputProps={this.commonInputProps}
              popupVisible={visibleProps.visible}
              onUpdateValue={this.updateValue}
            />
          )}
        </t-popup>
      </div>
    );

    if (!props.tips) {
      return mainContent;
    }

    return (
      <div
        ref={this.selectInputWrapRef}
        className={classNames(`${this.classPrefix}-select-input__wrap`, props.innerClass)}
        style={props.innerStyle}
      >
        {mainContent}
        {props.tips && (
          <div
            className={`${this.classPrefix}-input__tips ${this.classPrefix}-input__tips--${props.status || 'normal'}`}
          >
            {props.tips}
          </div>
        )}
      </div>
    );
  }
}

export default SelectInput;
