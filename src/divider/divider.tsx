import { classNames, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { type StyledProps } from '../common';
import { type TdDividerProps } from './type';

export interface DividerProps extends TdDividerProps, StyledProps {}

@tag('t-divider')
export default class Divider extends Component<DividerProps> {
  // 由于::before, ::after伪元素，inline style不能覆盖，所以必须注入css变量
  static css = [
    `
      .t-divider {
        border-top-width: var(--td-divider-width, 1px);
        border-top-color: var(--td-divider-color, inherit);
      }
      .t-divider--vertical {
        border-left-width: var(--td-divider-width, 1px);
        border-left-color: var(--td-divider-color, inherit);
      }
      .t-divider--with-text::before,
      .t-divider--with-text::after {
        border-top-width: var(--td-divider-width, 1px);
        border-top-color: var(--td-divider-color, inherit);
      }
      .t-divider--dashed.t-divider--with-text::before,
      .t-divider--dashed.t-divider--with-text::after {
        border-top-width: var(--td-divider-width, 1px);
      }
      .t-divider--vertical.t-divider--dashed {
        border-left-width: var(--td-divider-width, 1px);
      }
  `,
  ];

  static defaultProps = {
    align: 'center',
    dashed: false,
    layout: 'horizontal',
  };

  static propTypes = {
    align: String,
    content: Object,
    dashed: Boolean,
    layout: String,
    width: [String, Number],
  };

  componentName = `${getClassPrefix()}-divider`;

  render(props: OmiProps<DividerProps>) {
    const childNode = props.content || props.children;

    const showText = props.layout !== 'vertical' && !!childNode;
    const dividerClassNames = classNames(
      `${this.componentName}`,
      {
        [`${this.componentName}--${props.layout}`]: props.layout,
        [`${this.componentName}--dashed`]: !!props.dashed,
        [`${this.componentName}--with-text`]: showText,
        [`${this.componentName}--with-text-${props.align}`]: showText,
      },
      props.innerClass,
    );

    const customStyle: Record<string, string> = {};
    if (props.width !== undefined) {
      const widthValue = typeof props.width === 'number' ? `${props.width}px` : props.width;
      customStyle['--td-divider-width'] = widthValue;
    }
    if (props.color) {
      customStyle['--td-divider-color'] = props.color;
    }

    return (
      <div class={dividerClassNames} style={{ ...customStyle, ...props.innerStyle }}>
        {showText ? <span class={`${this.componentName}__inner-text`}>{childNode}</span> : null}
      </div>
    );
  }
}
