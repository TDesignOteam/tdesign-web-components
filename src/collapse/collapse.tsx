import { bind, Component, OmiProps, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { StyledProps, TNode } from '../common';
import { TdCollapseProps } from './type';

export interface CollapseProps extends TdCollapseProps, StyledProps {}

@tag('t-collapse')
export default class Collapse extends Component<TdCollapseProps> {
  static propTypes = {
    borderless: Boolean,
    defaultExpandAll: Boolean,
    disabled: Boolean,
    expandIconPlacement: String,
    expandMutex: Boolean,
    expandOnRowClick: Boolean,
    value: Array,
    defaultValue: Array,
    onChange: Function,
  };

  static defaultProps = {
    borderless: false,
    defaultExpandAll: false,
    expandIconPlacement: 'left',
    expandMutex: false,
    expandOnRowClick: true,
    defaultValue: [],
  };

  pCollapseValue = signal([]);

  innerBorderless = signal(false);

  innerDefaultExpandAll = signal(false);

  innerDisabled = signal(false);

  innerExpandIconPlacement: Omi.SignalValue<TdCollapseProps['expandIconPlacement']> = signal('left');

  innerExpandOnRowClick = signal(true);

  get collapseValue() {
    if (this.props.value) return this.props.value;
    return this.pCollapseValue.value;
  }

  @bind
  updateCollapseValue(value) {
    const index = this.collapseValue.indexOf(value);
    let newValue = [...this.collapseValue];
    if (index >= 0) {
      newValue.splice(index, 1);
    } else if (this.props.expandMutex) {
      newValue = [value];
    } else {
      newValue.push(value);
    }
    this.pCollapseValue.value = newValue;
    this.fire('change', newValue);
  }

  provide = {
    getUniqId: (() => {
      let index = 0;
      return () => (index += 1);
    })(),
    getCollapseValue: () => this.collapseValue,
    updateCollapseValue: this.updateCollapseValue,
    borderless: this.innerBorderless,
    defaultExpandAll: this.innerDefaultExpandAll,
    collapseProps: this.props,
    disabled: this.innerDisabled,
    expandIconPlacement: this.innerExpandIconPlacement,
    expandOnRowClick: this.innerExpandOnRowClick,
  };

  innerChecked: any = signal(null);

  install(): void {
    const { defaultValue, borderless, defaultExpandAll, disabled, expandIconPlacement, expandOnRowClick } = this.props;
    this.pCollapseValue.value = defaultValue;
    this.innerBorderless.value = borderless;
    this.innerDefaultExpandAll.value = defaultExpandAll;
    this.innerDisabled.value = disabled;
    this.innerExpandIconPlacement.value = expandIconPlacement || 'left';
    if (typeof expandOnRowClick !== 'undefined') {
      this.innerExpandOnRowClick.value = expandOnRowClick;
    }
  }

  render(props: OmiProps<CollapseProps>): TNode {
    const { innerClass, innerStyle, borderless } = props;

    const classes = classname(
      `${classPrefix}-collapse`,
      {
        [`${classPrefix}--border-less`]: !!borderless,
      },
      innerClass,
    );

    return (
      <div className={classes} style={innerStyle}>
        <slot></slot>
      </div>
    );
  }
}
