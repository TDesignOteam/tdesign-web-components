import '../select-input';
import './Option';
import '../common/fake-arrow';
import '../loading';

import { classNames, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { setExportparts } from '../_util/dom';
import { selectDefaultProps } from './defaultProps';
import { SelectValue, TdOptionProps, TdSelectProps } from './type';

@tag('t-select')
export default class Select extends Component<TdSelectProps> {
  static css = [];

  static defaultProps = selectDefaultProps;

  static propTypes = {
    autoWidth: Boolean,
    borderless: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    loading: Boolean,
    multiple: Boolean,
    options: Array,
    placeholder: String,
    popupVisible: Boolean,
    defaultPopupVisible: Boolean,
    popupProps: Object,
    showArrow: Boolean,
    size: String,
    suffixIcon: Object,
    value: [String, Number, Boolean, Object, Array],
    defaultValue: [String, Number, Boolean, Object, Array],
    onChange: Function,
    onClear: Function,
    onPopupVisibleChange: Function,
  };

  state = {
    innerValue: undefined,
    innerPopupVisible: false,
  };

  install() {
    this.state.innerValue = this.props.value !== undefined ? this.props.value : this.props.defaultValue;
    this.state.innerPopupVisible =
      this.props.popupVisible !== undefined ? this.props.popupVisible : this.props.defaultPopupVisible;
  }

  ready() {
    setExportparts(this);
  }

  receiveProps(props: TdSelectProps, oldProps: TdSelectProps) {
    if (props.value !== undefined && props.value !== oldProps.value) {
      this.state.innerValue = props.value;
    }
    if (props.popupVisible !== undefined && props.popupVisible !== oldProps.popupVisible) {
      this.state.innerPopupVisible = props.popupVisible;
    }
  }

  handleOptionClick = (val: SelectValue, context: { e: MouseEvent; label?: string }) => {
    const { multiple, options } = this.props;
    if (this.props.value === undefined) {
      this.state.innerValue = val;
    }

    if (!multiple) {
      if (this.props.popupVisible === undefined) {
        this.state.innerPopupVisible = false;
      }
      this.props.onPopupVisibleChange?.(false, { trigger: 'trigger-element-click' as any, e: context.e });
    }

    // Compute selected options based on current value and options
    const selectedOptions = (options || []).filter((opt) => {
      const optValue = (opt as TdOptionProps).value;
      if (multiple) {
        return Array.isArray(val) ? val.includes(optValue) : false;
      }
      return optValue === val;
    });

    this.props.onChange?.(val, {
      selectedOptions,
      trigger: 'check',
      e: context.e,
    });
    this.update();
  };

  handlePopupVisibleChange = (visible: boolean, context: any) => {
    if (this.props.popupVisible === undefined) {
      this.state.innerPopupVisible = visible;
    }
    this.props.onPopupVisibleChange?.(visible, context);
    this.update();
  };

  handleClear = (context: { e: MouseEvent }) => {
    const { multiple } = this.props;
    const clearedValue = multiple ? [] : undefined;
    if (this.props.value === undefined) {
      this.state.innerValue = clearedValue as SelectValue;
    }
    this.props.onChange?.(clearedValue as SelectValue, {
      selectedOptions: [],
      trigger: 'clear',
      e: context.e,
    });
    this.props.onClear?.(context);
    this.update();
  };

  render(props: OmiProps<TdSelectProps>) {
    const {
      options,
      placeholder,
      disabled,
      size,
      clearable,
      multiple,
      autoWidth,
      borderless,
      suffixIcon: suffixIconProp,
      loading,
      showArrow,
      popupVisible: popupVisibleProp,
      popupProps,
    } = props;
    const { innerValue, innerPopupVisible } = this.state;
    const classPrefix = getClassPrefix();
    const name = `${classPrefix}-select`;
    const popupVisible = popupVisibleProp ?? innerPopupVisible;

    let displayValue = innerValue;
    if (!multiple && innerValue !== undefined && options) {
      const selectedOption = options.find((opt) => (opt as TdOptionProps).value === innerValue);
      if (selectedOption) {
        displayValue = (selectedOption as TdOptionProps).label;
      }
    }

    const optionsList = options?.map((option, index) => {
      const opt = option as TdOptionProps;
      return (
        <t-option
          key={opt.value || index}
          {...opt}
          size={size}
          multiple={multiple}
          selected={multiple ? Array.isArray(innerValue) && innerValue.includes(opt.value) : innerValue === opt.value}
          onClick={({ e }) => this.handleOptionClick(opt.value, { e, label: opt.label })}
        />
      );
    });

    const dropdownInnerClass = classNames(`${classPrefix}-select__dropdown-inner`, {
      [`${classPrefix}-select__dropdown-inner--size-s`]: size === 'small',
      [`${classPrefix}-select__dropdown-inner--size-l`]: size === 'large',
    });

    const panelContent = (
      <div className={dropdownInnerClass}>
        <ul className={`${classPrefix}-select__list`}>{optionsList}</ul>
      </div>
    );

    const renderSuffixIcon = () => {
      if (suffixIconProp) {
        return suffixIconProp;
      }
      if (loading) {
        return (
          <t-loading
            className={classNames(`t-icon, ${name}__right-icon`, `${name}__active-icon`)}
            loading={true}
            size="small"
          />
        );
      }
      if (!showArrow) {
        return null;
      }
      return (
        <t-fake-arrow
          className={`${name}__right-icon`}
          isActive={popupVisible}
          disabled={disabled}
          style={{ height: '16px' }}
        />
      );
    };

    return (
      <div className={`${classPrefix}-select__wrap`}>
        <t-select-input
          className={`${classPrefix}-select`}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          clearable={clearable}
          autoWidth={autoWidth}
          borderless={borderless}
          popupVisible={popupVisible}
          suffixIcon={renderSuffixIcon()}
          onPopupVisibleChange={this.handlePopupVisibleChange}
          onClear={this.handleClear}
          panel={panelContent}
          multiple={multiple}
          popupProps={{
            ...popupProps,
            overlayClassName: classNames(`${classPrefix}-select__dropdown`, popupProps?.overlayClassName),
          }}
        />
      </div>
    );
  }
}
