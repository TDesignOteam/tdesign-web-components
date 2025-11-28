import 'tdesign-web-components/range-input';
import 'tdesign-web-components/popup';

import { classNames, Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { setExportparts } from '../_util/dom';
import { StyledProps } from '../common';
import useOverlayInnerStyle from '../select-input/useOverlayInnerStyle';
import { TdRangeInputPopupProps } from './type';

export interface RangeInputPopupProps extends TdRangeInputPopupProps, StyledProps {}

@tag('t-range-input-popup')
export default class RangeInputPopup extends Component<RangeInputPopupProps> {
  classPrefix = getClassPrefix();

  inputRef = createRef();

  innerInputValue = undefined;

  cachedOverlayWidth?: string;

  lockedTriggerElement?: HTMLElement;

  lockedTriggerOriginalWidth?: string;

  install() {
    const { inputValue, defaultInputValue } = this.props;
    this.innerInputValue = inputValue !== undefined ? inputValue : defaultInputValue;
  }

  ready() {
    setExportparts(this);
  }

  receiveProps(nextProps: { inputValue: any; visible?: boolean }) {
    // 受控场景下，同步外部值到内部缓存
    if (nextProps.inputValue !== undefined) {
      this.innerInputValue = nextProps.inputValue;
    }
  }

  private handleRangeInputChange = (evt: CustomEvent) => {
    const detail = (evt && evt.detail) || {};
    const { value: nextValue, context } = detail;

    // 未受控则更新内部值
    if (this.props.inputValue === undefined) {
      this.innerInputValue = nextValue;
      this.update();
    }
    // 透传给外部
    this.props.onInputChange?.(nextValue, context);
  };

  render(props: RangeInputPopupProps) {
    const {
      panel,
      popupVisible,
      disabled,
      popupProps,
      status,
      tips,
      inputValue,
      rangeInputProps,
      readonly,
      className,
      style,
      innerStyle,
      autoWidth,
      clearable,
      suffixIcon,
    } = props;

    const { tOverlayInnerStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayInnerStyle(
      { ...props, allowInput: false },
      undefined,
      this,
    );

    const isVisible = popupVisible ?? innerPopupVisible;

    if (!isVisible) {
      this.cachedOverlayWidth = undefined;
      if (this.lockedTriggerElement && this.lockedTriggerOriginalWidth !== undefined) {
        this.lockedTriggerElement.style.width = this.lockedTriggerOriginalWidth;
      }
      this.lockedTriggerElement = undefined;
      this.lockedTriggerOriginalWidth = undefined;
    }

    // 计算 panel 宽度，支持自定义或和输入框宽度保持一致
    const overlayInnerStyle = (triggerEl: HTMLElement, popupEl: HTMLElement) => {
      // 如果设置了autoWidth，则不强制宽度与输入框一致
      if (!autoWidth) {
        if (!this.cachedOverlayWidth && triggerEl) {
          const { width } = triggerEl.getBoundingClientRect();
          if (Number.isFinite(width) && width > 0) {
            this.cachedOverlayWidth = `${Math.round(width)}px`;
          }
        }

        if (triggerEl && !this.lockedTriggerElement) {
          this.lockedTriggerElement = triggerEl;
          this.lockedTriggerOriginalWidth = triggerEl.style.width;
        }
      }

      const baseStyle = tOverlayInnerStyle?.() || {};
      const resolvedBase = typeof baseStyle === 'function' ? baseStyle(triggerEl, popupEl) || {} : baseStyle;
      const resolvedExternal =
        typeof popupProps?.overlayInnerStyle === 'function'
          ? popupProps.overlayInnerStyle(triggerEl, popupEl) || {}
          : popupProps?.overlayInnerStyle || {};

      const merged = {
        ...resolvedBase,
        ...resolvedExternal,
        marginTop: '16px',
      } as Record<string, any>;

      if (!autoWidth && this.cachedOverlayWidth) {
        merged.width = this.cachedOverlayWidth;
      }

      if (!autoWidth && this.lockedTriggerElement && this.cachedOverlayWidth) {
        this.lockedTriggerElement.style.width = this.cachedOverlayWidth;
      }

      return merged;
    };

    const popupConfig = popupProps ?? {};
    const rangeInputConfig = rangeInputProps ?? {};
    const value = inputValue !== undefined ? inputValue : this.innerInputValue ?? [];
    const name = `${this.classPrefix}-range-input-popup`;
    const wrapperClassName = classNames(name, className, {
      [`${name}--visible`]: isVisible,
    });
    const wrapperStyle = { ...(style || {}), ...(innerStyle || {}) };

    return (
      <div className={wrapperClassName} style={wrapperStyle} ref={this.inputRef}>
        <t-popup
          hideEmptyPopup
          content={panel}
          trigger="click"
          placement="bottom-left"
          showArrow={false}
          visible={isVisible}
          onVisibleChange={onInnerPopupVisibleChange}
          disabled={disabled}
          {...popupConfig}
          overlayInnerStyle={overlayInnerStyle}
        >
          <t-range-input
            disabled={disabled}
            status={status}
            tips={tips}
            value={value}
            onChange={this.handleRangeInputChange}
            readonly={readonly}
            clearable={clearable}
            suffixIcon={suffixIcon}
            {...rangeInputConfig}
          />
        </t-popup>
      </div>
    );
  }
}
