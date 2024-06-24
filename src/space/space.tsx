import { toArray } from 'lodash';
import { classNames, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { type StyledProps } from '../common';
import { TdSpaceProps } from './type';

export interface SpaceProps extends TdSpaceProps, StyledProps {}

const SizeMap = { small: '8px', medium: '16px', large: '24px' };

@tag('t-space')
export default class Space extends Component<SpaceProps> {
  static css = [];

  static defaultProps = { breakLine: false, direction: 'horizontal', size: 'medium' };

  static propTypes = {
    algin: String,
    breakLine: Boolean,
    direction: String,
    separator: Object,
    size: Object,
  };

  componentName = `${getClassPrefix()}-space`;

  renderGap = '';

  renderStyle = {
    gap: this.renderGap,
    ...(this.props.breakLine ? { flexWrap: 'wrap' } : {}),
    ...this.props.style,
  };

  install() {
    if (Array.isArray(this.props.size)) {
      this.renderGap = this.props.size
        .map((s: string | number) => {
          if (typeof s === 'number') return `${s}px`;
          if (typeof s === 'string') return SizeMap[s] || this.props.size;
          return s;
        })
        .join(' ');
    } else if (typeof this.props.size === 'string') {
      this.renderGap = SizeMap[this.props.size] || this.props.size;
    } else if (typeof this.props.size === 'number') {
      this.renderGap = `${this.props.size}px`;
    }

    this.renderStyle = {
      gap: this.renderGap,
      ...(this.props.breakLine ? { flexWrap: 'wrap' } : {}),
      ...this.props.style,
    };
  }

  render(props: OmiProps<SpaceProps>) {
    function renderChildren() {
      const children = toArray(props.children);
      const childCount = children.length;
      return children.map((child, index) => {
        // const separatorNode = renderTNodeJSX(this, 'separator') check 效果
        const showSeparator = index + 1 !== childCount && props.separator;
        return (
          <>
            <div key={index} className={`${this.componentName}-item`}>
              {child}
            </div>
            {showSeparator && <div className={`${this.componentName}-item-separator`}>{props.separator}</div>}
          </>
        );
      });
    }
    return (
      <div
        style={this.renderStyle}
        class={classNames(`${this.componentName}`, props.class, {
          [`${this.componentName}-align-${props.align}`]: props.align,
          [`${this.componentName}-${props.direction}`]: props.direction,
        })}
      >
        {renderChildren()}
      </div>
    );
  }
}
