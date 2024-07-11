import 'tdesign-web-components/tooltip';

import { bind, Component, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { StyledProps } from '../common';
import { TdMenuItemProps } from './type';

export interface MenuItemProps extends TdMenuItemProps, StyledProps {}

@tag('t-menu-item')
export default class MenuItem extends Component<MenuItemProps> {
  static css = `
    .${getClassPrefix()}-menu__item--inner {
      width: 100%;
      height: 100%;
    }

    .${getClassPrefix()}-menu__item--has-icon .${getClassPrefix()}-menu__content,
    .${getClassPrefix()}-menu__item--has-icon .${getClassPrefix()}-menu__item-link {
      margin-left: var(--td-comp-margin-s);
    }

    .${getClassPrefix()}-menu__item > ${getClassPrefix()}-tooltip {
      position: absolute;
      inset: 0;
    }
      
    .${getClassPrefix()}-menu__item .${getClassPrefix()}-menu__item-tooltip-inner {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    } 
  `;

  static propTypes = {
    label: Object,
    disabled: Boolean,
    href: String,
    icon: Object,
    target: String,
    value: [String, Number],
    onClick: Function,
  };

  inject = ['active', 'onChange', 'collapsed'];

  constructor() {
    super();
    this.addEventListener('click', this.handleClick);
  }

  @bind
  handleClick(evt: MouseEvent) {
    if (!(evt instanceof MouseEvent)) {
      // 防止死循环 下面还会 fire('click') 又触发了当前函数的执行
      return;
    }
    // 阻止自定义dom上绑定的onClick原生事件
    evt.stopImmediatePropagation();
    if (this.props.disabled) {
      return;
    }
    this.fire('click', {
      context: this,
      value: this.props.value,
    });
    this.injection.onChange?.(this.props.value);
  }

  uninstalled() {
    this.removeEventListener('click', this.handleClick);
  }

  render() {
    const { label, icon, className, disabled, href, target, value } = this.props;

    const classPrefix = getClassPrefix();

    const lightIcon = convertToLightDomNode(icon);

    this.className = classname(`${classPrefix}-menu__item`, className, {
      [`${classPrefix}-is-disabled`]: disabled,
      [`${classPrefix}-is-active`]: value === this.injection.active.value,
      [`${classPrefix}-menu__item--plain`]: !icon,
      [`${classPrefix}-menu__item--has-icon`]: !!lightIcon,
    });

    const content = (
      <div>
        {lightIcon}
        {href ? (
          <a href={href} target={target} className={classname(`${classPrefix}-menu__item-link`)}>
            <span className={`${classPrefix}-menu__content`}>{label}</span>
          </a>
        ) : (
          <span className={`${classPrefix}-menu__content`}>{label}</span>
        )}
      </div>
    );

    if (this.injection.collapsed.value && !this.props.disabled) {
      return (
        <t-tooltip content={label} placement="right">
          <div className={`${classPrefix}-menu__item-tooltip-inner`}>{content}</div>
        </t-tooltip>
      );
    }

    return content;
  }
}
