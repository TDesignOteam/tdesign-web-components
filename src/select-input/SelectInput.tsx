import '../loading';
import './SelectInputMultiple';
import './SelectInputSingle';
import '../popup';

import classNames from 'classnames';
import { pick } from 'lodash';
import { Component, createRef, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
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
    `.${classPrefix}-select-input > t-popup {
      display: inline-flex;
      width: 100%;
    };`,
  ];

  static defaultProps = selectInputDefaultProps;

  selectInputRef = createRef();

  selectInputWrapRef = createRef();

  classPrefix = classPrefix;

  commonInputProps: SelectInputCommonProperties;

  tOverlayInnerStyle;

  innerPopupVisible;

  onInnerPopupVisibleChange;

  install(): void {
    const { loading, suffixIcon } = this.props;
    this.commonInputProps = {
      ...pick(this.props, COMMON_PROPERTIES),
      suffixIcon: loading ? <t-loading loading size="small" /> : suffixIcon,
    };

    const { innerPopupVisible, tOverlayInnerStyle, onInnerPopupVisibleChange } = useOverlayInnerStyle(this.props, {
      // afterHidePopup: this.onInnerBlur,
    });
    this.tOverlayInnerStyle = tOverlayInnerStyle;
    this.innerPopupVisible = innerPopupVisible;
    this.onInnerPopupVisibleChange = onInnerPopupVisibleChange;
  }

  // onInnerBlur(ctx: PopupVisibleChangeContext) {
  //   const inputValue = this.props.multiple ? multipleInputValue : singleInputValue;
  //   const params: Parameters<TdSelectInputProps['onBlur']>[1] = { e: ctx.e, inputValue };
  //   this.props.onBlur?.(this.props.value, params);
  // }

  render(props: SelectInputProps | OmiProps<SelectInputProps, any>) {
    const { multiple, value, popupVisible, popupProps, borderless, disabled } = props;

    // 浮层显示的受控与非受控
    const visibleProps = { visible: popupVisible ?? this.innerPopupVisible };

    const popupClasses = classNames([
      props.className,
      `${this.classPrefix}-select-input`,
      {
        [`${this.classPrefix}-select-input--borderless`]: borderless,
        [`${this.classPrefix}-select-input--multiple`]: multiple,
        [`${this.classPrefix}-select-input--popup-visible`]: popupVisible ?? this.innerPopupVisible,
        [`${this.classPrefix}-select-input--empty`]: value instanceof Array ? !value.length : !value,
      },
    ]);

    const mainContent = (
      <div className={popupClasses} style={props.innerStyle} onClick={(e) => console.log('333', e)}>
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
          overlayInnerStyle={this.tOverlayInnerStyle}
        >
          {multiple ? (
            <t-select-input-multiple
              {...props}
              commonInputProps={this.commonInputProps}
              popupVisible={visibleProps.visible}
            />
          ) : (
            <t-select-input-single
              {...props}
              commonInputProps={this.commonInputProps}
              popupVisible={visibleProps.visible}
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
        className={`${this.classPrefix}-select-input__wrap`}
        onClick={(e) => console.log('222', e)}
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
