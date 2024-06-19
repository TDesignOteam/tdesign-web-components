import { Component, signal, tag } from 'omi';

import log from '../_common/js/log';
import classname, { classPrefix, getCommonClassName } from '../_util/classname';
import parseTNode from '../_util/parseTNode';
import { StyledProps, TNode } from '../common';
// import Loading from '../loading';
import { SwitchValue, TdSwitchProps } from './type';

export type SwitchChangeEventHandler = (value: boolean, event: MouseEvent) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

export interface SwitchProps<T extends SwitchValue = SwitchValue> extends TdSwitchProps<T>, StyledProps {}

@tag('t-switch')
export default class Switch extends Component<SwitchProps> {
  constructor() {
    super();
    this.props = {
      label: [],
      loading: false,
      size: 'medium',
      ...this.props,
    };
  }

  innerChecked: Omi.SignalValue<SwitchValue> = signal(null);

  get contentNode() {
    const { value, label } = this.props;
    if (Array.isArray(label)) {
      const [activeContent = '', inactiveContent = ''] = label;
      const content = this.innerChecked ? activeContent : inactiveContent;
      return parseTNode(content, { value });
    }
    return parseTNode(label, { value });
  }

  get isControlled() {
    const { value } = this.props;
    return typeof value !== 'undefined';
  }

  onInternalClick(e: MouseEvent) {
    if (this.props.disabled) {
      return;
    }
    const [activeValue = true, inactiveValue = false] = this.props.customValue || [];
    const changedValue = !this.innerChecked ? activeValue : inactiveValue;

    if (!this.isControlled) {
      this.innerChecked.value = !this.innerChecked;
    }

    this.props?.onChange?.(changedValue, { e });
  }

  install(): void {
    const { value, defaultValue, customValue } = this.props;
    const [activeValue = true] = customValue || [];
    const initChecked = defaultValue === activeValue || value === activeValue;
    this.innerChecked.value = initChecked;

    if (Array.isArray(customValue) && !customValue.includes(value)) {
      log.error('Switch', `value is not in customValue: ${JSON.stringify(customValue)}`);
    }
    if (this.isControlled) {
      this.innerChecked.value = value === activeValue;
    }
  }

  render(props: SwitchProps): TNode {
    const { className, disabled, loading, size, style } = props;

    const { SIZE, STATUS } = getCommonClassName();
    const switchClassName = classname(
      `${classPrefix}-switch`,
      className,
      {
        [STATUS.checked]: this.innerChecked,
        [STATUS.disabled]: disabled,
        [STATUS.loading]: loading,
      },
      SIZE[size],
    );
    return (
      <button
        style={style}
        type="button"
        role="switch"
        disabled={disabled || loading}
        className={switchClassName}
        onClick={this.onInternalClick}
      >
        {/* <span className={`${classPrefix}-switch__handle`}>{loading && <Loading loading size="small" />}</span> */}
        <div className={`${classPrefix}-switch__content`}>{this.contentNode}</div>
      </button>
    );
  }
}
