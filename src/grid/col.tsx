import { isObject } from 'lodash-es';
import { Component, tag } from 'omi';

import classNames, { getClassPrefix } from '../_util/classname';
import { setStyle } from '../_util/dom';
import { StyledProps, TNode } from '../common';
import { colDefaultProps } from './defaultProps';
import { TdColProps, TdRowProps } from './type';

type FlexType = number | 'none' | 'auto' | string;

export interface ColProps extends TdColProps, StyledProps {
  /**
   * 文本内容
   */
  content?: TNode;
  /**
   * 文本内容，在配合t-row 使用时，需要使用content
   */
  children?: TNode;
}

const calcColPadding = (gutter: TdRowProps['gutter'], currentSize: string) => {
  const paddingObj = {};
  if (typeof gutter === 'number') {
    Object.assign(paddingObj, {
      paddingLeft: `${gutter / 2}px`,
      paddingRight: `${gutter / 2}px`,
    });
  } else if (Array.isArray(gutter) && gutter.length) {
    if (typeof gutter[0] === 'number') {
      Object.assign(paddingObj, {
        paddingLeft: `${gutter[0] / 2}px`,
        paddingRight: `${gutter[0] / 2}px`,
      });
    }

    if (isObject(gutter[0]) && gutter[0][currentSize]) {
      Object.assign(paddingObj, {
        paddingLeft: `${gutter[0][currentSize] / 2}px`,
        paddingRight: `${gutter[0][currentSize] / 2}px`,
      });
    }
  } else if (isObject(gutter) && gutter[currentSize]) {
    Object.assign(paddingObj, {
      paddingLeft: `${gutter[currentSize] / 2}px`,
      paddingRight: `${gutter[currentSize] / 2}px`,
    });
  }
  return paddingObj;
};

const parseFlex = (flex: FlexType) => {
  if (typeof flex === 'number') {
    return `${flex} ${flex} auto`;
  }

  if (/^\d+(\.\d+)?(px|r?em|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }

  return flex;
};

const classPrefix = getClassPrefix();

@tag('t-col')
export default class Col extends Component<ColProps> {
  static defaultProps = colDefaultProps;

  static propTypes = {
    flex: [String, Number],
    lg: [Number, Object],
    md: [Number, Object],
    offset: Number,
    order: Number,
    pull: Number,
    push: Number,
    sm: [Number, Object],
    span: Number,
    xl: [Number, Object],
    xs: [Number, Object],
    xxl: [Number, Object],
  };

  inject = ['size', 'gutter'];

  get sizeClasses() {
    const allSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    return allSizes.reduce((acc, currSize) => {
      const sizeProp = this.props[currSize];
      let sizeObj: any = {};
      if (typeof sizeProp === 'number') {
        sizeObj.span = sizeProp;
      } else if (isObject(sizeProp)) {
        sizeObj = sizeProp || {};
      }

      return {
        ...acc,
        [`${classPrefix}-col-${currSize}-${sizeObj.span}`]: sizeObj.span !== undefined,
        [`${classPrefix}-col-${currSize}-order-${sizeObj.order}`]: parseInt(sizeObj.order, 10) >= 0,
        [`${classPrefix}-col-${currSize}-offset-${sizeObj.offset}`]: parseInt(sizeObj.offset, 10) >= 0,
        [`${classPrefix}-col-${currSize}-push-${sizeObj.push}`]: parseInt(sizeObj.push, 10) >= 0,
        [`${classPrefix}-col-${currSize}-pull-${sizeObj.pull}`]: parseInt(sizeObj.pull, 10) >= 0,
      };
    }, {});
  }

  ready(): void {
    const {
      flex,
      span,
      offset,
      order,
      pull,
      push,
      innerClass,
      innerStyle,
      gutter: rowGutter,
      size: rowSize,
    } = this.props as ColProps & { gutter: TdRowProps['gutter']; size: string };
    const colClassNames = classNames(
      `${classPrefix}-col`,
      {
        [`${classPrefix}-col-${span}`]: span !== undefined,
        [`${classPrefix}-col-offset-${offset}`]: parseInt(offset as unknown as string, 10) >= 0,
        [`${classPrefix}-col-pull-${pull}`]: parseInt(pull as unknown as string, 10) >= 0,
        [`${classPrefix}-col-push-${push}`]: parseInt(push as unknown as string, 10) >= 0,
        [`${classPrefix}-col-order-${order}`]: parseInt(order as unknown as string, 10) >= 0,
      },
      this.sizeClasses,
      innerClass,
    );

    const colStyle = {
      ...calcColPadding(rowGutter, rowSize),
      ...innerStyle,
    };
    flex && ((colStyle as any).flex = parseFlex(flex));

    const dom = (this.constructor as any).isLightDOM ? this : this.shadowRoot.host;
    dom.setAttribute('class', colClassNames);
    Object.keys(colStyle).forEach((key) => {
      setStyle((dom as HTMLElement).style, key, colStyle[key]);
    });
  }

  render(props: ColProps) {
    const { content, children } = props;
    return content || children;
  }
}
