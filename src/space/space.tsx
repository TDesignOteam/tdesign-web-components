import { toArray } from 'lodash-es';
import { classNames, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { type StyledProps } from '../common';
import { styleSheet } from './style';
import { TdSpaceProps } from './type';

export interface SpaceProps extends TdSpaceProps, StyledProps {}

const SizeMap = { small: '8px', medium: '16px', large: '24px' };

@tag('t-space')
export default class Space extends Component<SpaceProps> {
  static css = [
    styleSheet,
    `:host {
      display: inline-flex;
      vertical-align: middle;
    }
    .${getClassPrefix()}-space {
      width: 100%;
    }
    `,
  ];

  static defaultProps = { breakLine: false, direction: 'horizontal', size: 'medium' };

  static propTypes = {
    align: String,
    breakLine: Boolean,
    direction: String,
    separator: Object,
    size: Object,
  };

  componentName = `${getClassPrefix()}-space`;

  renderGap = '';

  renderStyle = {};

  install() {
    this.updateHostStyle();
  }

  updated() {
    this.updateHostStyle();
  }

  updateHostStyle() {
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
      ...this.props.innerStyle,
    };
  }

  get contentNode() {
    const { children, separator } = this.props;
    const childrenArr = toArray(children);
    return childrenArr.map((child, index) => {
      const showSeparator = index + 1 !== childrenArr.length && separator;
      return (
        <>
          <div key={index} className={`${this.componentName}-item`}>
            {child}
          </div>
          {showSeparator && <div className={`${this.componentName}-item-separator`}>{separator}</div>}
        </>
      );
    });
  }

  beforeRender(): void {
    this.innerHTML = '';
  }

  render(props: OmiProps<SpaceProps>) {
    return (
      <div
        class={classNames(
          `${this.componentName}`,
          {
            [`${this.componentName}-align-${props.align}`]: props.align,
            [`${this.componentName}-${props.direction}`]: props.direction,
            [`${this.componentName}--break-line`]: props.breakLine,
          },
          props.innerClass,
        )}
        style={{ ...this.renderStyle, width: '100%' }}
      >
        {this.contentNode.flat()}
      </div>
    );
  }
}
