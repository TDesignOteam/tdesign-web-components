import 'tdesign-icons-web-components/esm/components/chevron-right';
import './dropdownItem';
import '../divider';

import throttle from 'lodash/throttle';
import { Component, createRef, tag } from 'omi';

import classNames, { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { TNode } from '../common';
import { DropdownProps } from './dropdown';
import { DropdownOption } from './type';

export const propTypes = {
  direction: String,
  disabled: Boolean,
  hideAfterItemClick: Boolean,
  maxColumnWidth: [String, Number],
  maxHeight: Number,
  minColumnWidth: [String, Number],
  options: Array,
  panelBottomContent: [String, Number, Object, Function],
  panelTopContent: [String, Number, Object, Function],
  placement: String,
  popupProps: Object,
  trigger: String,
  popupCss: String,
  onClick: Function,
};
@tag('t-dropdown-menu')
export default class DropdownMenu extends Component<DropdownProps> {
  static propTypes = propTypes;

  classPrefix = getClassPrefix();

  dropdownClass = `${this.classPrefix}-dropdown`;

  dropdownMenuClass = `${this.dropdownClass}__menu`;

  panelTopContentHeight = 0;

  menuRef = createRef<HTMLDivElement>();

  isOverMaxHeight = false;

  calcScrollTopMap = {};

  adjustHeight = () => {
    if (this.menuRef.current) {
      const menuHeight = (this.menuRef.current.childNodes?.length || 0) * 30;
      setTimeout(() => {
        if (this.props.panelTopContent) {
          const panelTopHeight =
            parseInt(getComputedStyle(this.menuRef.current.childNodes?.[0] as HTMLElement)?.height, 10) || 0;
          this.panelTopContentHeight = panelTopHeight;
        }
      });
      if (menuHeight >= this.props.maxHeight) this.isOverMaxHeight = true;
    }
  };

  handleItemClick = (options: { data: DropdownOption; context: { e: MouseEvent } }) => {
    const { data, context } = options;
    data?.onClick?.(data, context);
    this.props.onClick?.(data, context);
  };

  handleScroll = (e: MouseEvent, deep = 0) => {
    if (!e.target) return;
    const { scrollTop } = e.target as HTMLElement;
    this.calcScrollTopMap = { ...this.calcScrollTopMap, [deep]: scrollTop };
    this.update();
  };

  throttleUpdate = throttle(this.handleScroll, 10);

  renderOptions = (data: Array<DropdownOption | TNode>, deep: number) => {
    const { minColumnWidth = 10, maxColumnWidth = 160 } = this.props;
    const arr = [];
    let renderContent: TNode;
    data.forEach?.((menu, idx) => {
      const optionItem = { ...(menu as DropdownOption) };

      // 只有第一层子节点需要加上 panelTopContent 的高度
      const shouldCalcPanelTopContent = this.props.panelTopContent && deep > 0;

      if (optionItem.children) {
        optionItem.children = this.renderOptions(optionItem.children, deep + 1);
        renderContent = (
          <div key={idx}>
            <t-dropdown-item
              cls={classNames(
                optionItem.className,
                `${this.dropdownClass}__item`,
                `${this.dropdownClass}__item--suffix`,
              )}
              style={optionItem.style}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              prefixIcon={optionItem.prefixIcon}
              disabled={optionItem.disabled}
              minColumnWidth={minColumnWidth}
              maxColumnWidth={maxColumnWidth}
              isSubmenu={true}
            >
              <div className={`${this.dropdownClass}__item-content`}>
                <span className={`${this.dropdownClass}__item-text`}>{optionItem.content}</span>
                <t-icon-chevron-right className={`${this.dropdownClass}__item-direction`} size="16" />
              </div>
              <div
                className={classNames(`${this.dropdownClass}__submenu-wrapper`, {
                  [`${this.dropdownClass}__submenu-wrapper--${this.props.direction}`]: this.props.direction,
                })}
                style={{
                  position: 'absolute',
                  top: `${
                    idx * 30 -
                    this.calcScrollTopMap[deep] +
                    (shouldCalcPanelTopContent ? 0 : this.panelTopContentHeight)
                  }px`,
                }}
              >
                <div
                  className={classNames(`${this.dropdownClass}__submenu`, {
                    [`${this.dropdownClass}__submenu--disabled`]: optionItem.disabled,
                  })}
                  style={{
                    position: 'static',
                    maxHeight: `${this.props.maxHeight}px`,
                  }}
                  onScroll={(e: MouseEvent) => this.handleScroll(e, deep + 1)}
                >
                  <ul>{optionItem.children}</ul>
                </div>
              </div>
            </t-dropdown-item>
            {optionItem.divider ? <t-divider /> : null}
          </div>
        );
      } else {
        renderContent = (
          <div key={idx}>
            <t-dropdown-item
              cls={classNames(optionItem.className, `${this.dropdownClass}__item`)}
              style={optionItem.style}
              value={optionItem.value}
              theme={optionItem.theme}
              active={optionItem.active}
              prefixIcon={optionItem.prefixIcon}
              disabled={optionItem.disabled}
              minColumnWidth={minColumnWidth}
              maxColumnWidth={maxColumnWidth}
              onClick={
                optionItem.disabled || optionItem.children
                  ? () => null
                  : (value: string | number | { [key: string]: any }, context: { e: MouseEvent }) =>
                      this.handleItemClick({ data: optionItem, context })
              }
            >
              <span className={`${this.dropdownClass}__item-text`}>{optionItem.content}</span>
            </t-dropdown-item>
            {optionItem.divider ? convertToLightDomNode(<t-divider />) : null}
          </div>
        );
      }
      arr.push(renderContent);
    });
    return arr;
  };

  beforeUpdate() {
    this.adjustHeight();
  }

  ready(): void {
    this.adjustHeight();
    this.update();
  }

  render(props: DropdownProps) {
    const { options = [], maxHeight = 300, direction, panelTopContent, panelBottomContent } = props;
    return (
      <div
        className={classNames(this.dropdownMenuClass, `${this.dropdownMenuClass}--${direction}`, {
          [`${this.dropdownMenuClass}--overflow`]: this.isOverMaxHeight,
        })}
        style={{
          maxHeight: `${maxHeight}px`,
        }}
        ref={this.menuRef}
        onScroll={this.throttleUpdate}
      >
        {panelTopContent ? <div className={`${this.dropdownClass}__top-content`}>{panelTopContent}</div> : null}
        {this.renderOptions(options, 0)}
        {panelBottomContent ? (
          <div className={`${this.dropdownClass}__bottom-content`}>{panelBottomContent}</div>
        ) : null}
      </div>
    );
  }
}
