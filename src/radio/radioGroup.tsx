import 'tdesign-web-components/radio';

import { toArray } from 'lodash';
import { classNames, cloneElement, Component, OmiProps, tag } from 'omi';

import { getClassPrefix, getCommonClassName } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { StyledProps, TNode } from '../common';
import { CheckContextKey, CheckProps } from '../common/check';
import { TdRadioGroupProps } from './type';

export interface RadioGroupProps<T> extends TdRadioGroupProps<T>, StyledProps {
  content?: TNode;
  children?: TNode;
}

@tag('t-radio-group')
export default class RadioGroup<T = string | number> extends Component<RadioGroupProps<T>> {
  static propTypes = {
    allowUncheck: Boolean,
    checked: Boolean,
    defaultChecked: Boolean,
    content: [String, Number, Object, Function],
    children: [String, Number, Object, Function],
    disabled: Boolean,
    label: [String, Number, Object, Function],
    name: String,
    value: [String, Number],
    onChange: Function,
    onClick: Function,
  };

  static defaultProps: TdRadioGroupProps = {
    allowUncheck: false,
    disabled: undefined,
    size: 'medium',
    variant: 'outline',
    options: [],
  };

  private pValue: T;

  private radioGroupRef: HTMLDivElement | null = null;

  barStyle: Object = {};

  classPrefix = getClassPrefix();

  commonClassName = getCommonClassName();

  get internalValue() {
    if (this.props.value !== undefined) return this.props.value;
    return this.pValue;
  }

  get checkedRadioCls() {
    return `.${this.classPrefix}-radio-button.${this.classPrefix}-is-checked`;
  }

  setInternalValue = (value: T, context?: { e: Event | MouseEvent }) => {
    this.pValue = value;

    this.props?.onChange?.(value, context);
    this.calcBarStyle();
    this.update();
  };

  setBarStyle(value: Object) {
    this.barStyle = value;
    this.update();
  }

  calcBarStyle = () => {
    if (!this.props.variant.includes('filled')) {
      return;
    }
    setTimeout(() => {
      const checkedRadio = this.radioGroupRef?.querySelector?.(this.checkedRadioCls) as HTMLElement;
      if (!checkedRadio) {
        return this.setBarStyle({ width: 0 });
      }

      const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = checkedRadio;
      this.setBarStyle({
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
        left: `${offsetLeft}px`,
        top: `${offsetTop}px`,
      });
    });
  };

  renderBlock = () => {
    if (!this.props.variant.includes('filled')) {
      return null;
    }
    return <div style={this.barStyle} className={`${this.classPrefix}-radio-group__bg-block`}></div>;
  };

  renderOptions = () => {
    const Comp = this.props.variant.includes('filled') ? 't-radio-button' : 't-radio';
    return this.props.options.map((item) => {
      let label: TNode;
      let value: string | number;
      let disabled: boolean | undefined;
      if (typeof item === 'string' || typeof item === 'number') {
        label = item;
        value = item;
      } else {
        label = item.label;
        value = item.value;
        disabled = item.disabled;
      }
      return convertToLightDomNode(<Comp value={value} key={value} disabled={disabled} content={label} />);
    });
  };

  install(): void {
    this.pValue = this.props.value || this.props.defaultValue;
  }

  installed(): void {
    this.calcBarStyle();
  }

  receiveProps(
    props: RadioGroupProps<T> | OmiProps<RadioGroupProps<T>, any>,
    oldProps: RadioGroupProps<T> | OmiProps<RadioGroupProps<T>, any>,
  ) {
    if (props.value !== oldProps.value) {
      this.calcBarStyle();
    }
  }

  renderChildren() {
    const childrenList = toArray(this.props.content || this.props.children);
    if (childrenList.length > 0) {
      return childrenList.map((child, index) => {
        const childNode = cloneElement(child, {
          key: `radio-group-item-${index}`,
        });
        return convertToLightDomNode(childNode);
      });
    }
    return null;
  }

  provide = {
    // 通过回调函数控制选中行为
    [CheckContextKey]: (checkProps: CheckProps) => {
      // 如果已经受控，则不注入
      if (typeof checkProps.checked !== 'undefined') {
        return checkProps;
      }

      return {
        ...checkProps,
        name: this.props.name,
        // 有一个允许取消，就可以取消选中
        allowUncheck: checkProps.allowUncheck || this.props.allowUncheck,
        checked: this.internalValue === checkProps.value,
        disabled: checkProps.disabled || this.props.disabled,
        onChange: (checked, { e }) => {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }
          this.setInternalValue(checked ? (checkProps.value as T) : undefined, { e });
        },
      };
    },
  };

  render(props: OmiProps<RadioGroupProps<T>>) {
    const { className, style, size, variant } = props;

    return (
      <div
        ref={(node: HTMLDivElement) => (this.radioGroupRef = node)}
        style={style}
        className={classNames(`${this.classPrefix}-radio-group`, this.commonClassName.SIZE[size], className, {
          [`${this.classPrefix}-radio-group__outline`]: variant === 'outline',
          [`${this.classPrefix}-radio-group--filled`]: variant.includes('filled'),
          [`${this.classPrefix}-radio-group--primary-filled`]: variant === 'primary-filled',
        })}
      >
        {this.renderChildren() || this.renderOptions()}
        {this.renderBlock()}
      </div>
    );
  }
}
