import { classNames, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { optionDefaultProps } from './defaultProps';
import { TdOptionProps, TdSelectProps } from './type';

export interface OptionProps extends TdOptionProps {
  onClick?: (options: { value: string | number; label?: string; e: MouseEvent }) => void;
  selected?: boolean;
  index?: number;
  multiple?: boolean;
  size?: TdSelectProps['size'];
}

@tag('t-option')
export default class Option extends Component<OptionProps> {
  static css = [];

  static defaultProps = optionDefaultProps;

  static propTypes = {
    checkAll: Boolean,
    children: [String, Object, Function],
    content: [String, Object, Function],
    disabled: Boolean,
    label: String,
    title: String,
    value: [String, Number],
    selected: Boolean,
    index: Number,
    onClick: Function,
    multiple: Boolean,
    size: String,
  };

  handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (this.props.disabled) return;

    const { value, label } = this.props;
    this.props.onClick?.({ value: value as string | number, label, e });
  };

  render(props: OmiProps<OptionProps>) {
    const { disabled, label, content, children, selected, multiple, size } = props;
    const classPrefix = getClassPrefix();
    const commonClass = `${classPrefix}-select-option`;
    const optionClass = classNames(commonClass, {
      [`${classPrefix}-is-disabled`]: disabled,
      [`${classPrefix}-is-selected`]: selected,
      [`${classPrefix}-size-s`]: size === 'small',
      [`${classPrefix}-size-l`]: size === 'large',
    });

    const renderItem = () => {
      const optionalChildren = Array.isArray(children) && children.length === 0 ? null : children;
      const displayContent = content || optionalChildren || label;
      if (multiple) {
        return (
          <label
            className={classNames(`${classPrefix}-checkbox`, {
              [`${classPrefix}-is-disabled`]: disabled,
              [`${classPrefix}-is-checked`]: selected,
            })}
          >
            <input
              type="checkbox"
              className={`${classPrefix}-checkbox__former`}
              checked={selected}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
              }}
              readOnly
            />
            <span className={`${classPrefix}-checkbox__input`}></span>
            <span className={`${classPrefix}-checkbox__label`}>{displayContent}</span>
          </label>
        );
      }
      return <span>{displayContent}</span>;
    };

    return (
      <li
        className={optionClass}
        onClick={this.handleClick}
        title={props.title || (typeof label === 'string' ? label : '')}
      >
        {renderItem()}
      </li>
    );
  }
}
