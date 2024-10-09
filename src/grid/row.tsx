import isObject from 'lodash/isObject';
import { cloneElement, Component, createElement, tag } from 'omi';

import classNames, { getClassPrefix } from '../_util/classname';
import { getChildrenArray } from '../_util/component';
import { canUseDocument, getCssVarsValue } from '../_util/dom';
import { convertToLightDomNode } from '../_util/lightDom';
import { StyledProps, TNode } from '../common';
import { rowDefaultProps } from './defaultProps';
import { TdRowProps } from './type';

/**
 * Row 组件支持的属性。
 */
export interface RowProps extends TdRowProps, StyledProps {
  /**
   * 默认子元素内容
   */
  children: TNode;
}

const calcSize = (width: number) => {
  const smWidth = parseFloat(getCssVarsValue('--td-screen-sm') || '768');
  const mdWidth = parseFloat(getCssVarsValue('--td-screen-md') || '992');
  const lgWidth = parseFloat(getCssVarsValue('--td-screen-lg') || '1200');
  const xlWidth = parseFloat(getCssVarsValue('--td-screen-xl') || '1400');
  const xxlWidth = parseFloat(getCssVarsValue('--td-screen-xxl') || '1880');

  let size = 'xs';
  if (width >= xxlWidth) {
    size = 'xxl';
  } else if (width >= xlWidth) {
    size = 'xl';
  } else if (width >= lgWidth) {
    size = 'lg';
  } else if (width >= mdWidth) {
    size = 'md';
  } else if (width >= smWidth) {
    size = 'sm';
  } else {
    size = 'xs';
  }

  return size;
};

const calcRowStyle = (gutter: TdRowProps['gutter'], currentSize: string): object => {
  const rowStyle = {};
  if (typeof gutter === 'number') {
    Object.assign(rowStyle, {
      marginLeft: `${gutter / -2}px`,
      marginRight: `${gutter / -2}px`,
    });
  } else if (Array.isArray(gutter) && gutter.length) {
    if (typeof gutter[0] === 'number') {
      Object.assign(rowStyle, {
        marginLeft: `${gutter[0] / -2}px`,
        marginRight: `${gutter[0] / -2}px`,
      });
    }
    if (typeof gutter[1] === 'number') {
      Object.assign(rowStyle, { rowGap: `${gutter[1]}px` });
    }

    if (isObject(gutter[0]) && gutter[0][currentSize] !== undefined) {
      Object.assign(rowStyle, {
        marginLeft: `${gutter[0][currentSize] / -2}px`,
        marginRight: `${gutter[0][currentSize] / -2}px`,
      });
    }
    if (isObject(gutter[1]) && gutter[1][currentSize] !== undefined) {
      Object.assign(rowStyle, { rowGap: `${gutter[1][currentSize]}px` });
    }
  } else if (isObject(gutter) && gutter[currentSize]) {
    if (Array.isArray(gutter[currentSize]) && gutter[currentSize].length) {
      Object.assign(rowStyle, {
        marginLeft: `${gutter[currentSize][0] / -2}px`,
        marginRight: `${gutter[currentSize][0] / -2}px`,
      });
      Object.assign(rowStyle, { rowGap: `${gutter[currentSize][1]}px` });
    } else {
      Object.assign(rowStyle, {
        marginLeft: `${gutter[currentSize] / -2}px`,
        marginRight: `${gutter[currentSize] / -2}px`,
      });
    }
  }
  return rowStyle;
};

@tag('t-row')
export default class Row extends Component<RowProps> {
  static defaultProps = rowDefaultProps;

  static propTypes = {
    align: String,
    gutter: [Number, Object, Array],
    justify: String,
    tag: String,
  };

  size = canUseDocument ? calcSize(window.innerWidth) : 'md';

  provide = {
    size: this.size,
    gutter: this.props.gutter,
  };

  updateSize = () => {
    const currentSize = calcSize(window.innerWidth);
    if (currentSize !== this.size) {
      this.size = currentSize;
      this.updated();
    }
  };

  install(): void {
    window.addEventListener('resize', this.updateSize);
  }

  uninstall(): void {
    window.removeEventListener('resize', this.updateSize);
  }

  render(props: RowProps) {
    const { align, gutter, justify, tag: Tag, innerStyle, innerClass, ...otherRowProps } = props;

    delete otherRowProps.className;
    delete otherRowProps.style;
    delete otherRowProps.children;

    const classPrefix = getClassPrefix();
    const rowClassNames = classNames(
      `${classPrefix}-row`,
      {
        [`${classPrefix}-row--${justify}`]: true,
        [`${classPrefix}-row--${align}`]: true,
      },
      innerClass,
    );
    const rowStyle = {
      ...calcRowStyle(gutter, this.size),
      ...innerStyle,
    };

    const children = getChildrenArray(props.children).map((child, index) => {
      if (child?.nodeName === 't-col' || child?.nodeName === 't-col-light-dom') {
        return convertToLightDomNode(cloneElement(child, { key: `t-col-${index}`, size: this.size, gutter }));
      }
      return child;
    });

    return createElement(
      Tag,
      {
        className: rowClassNames,
        style: rowStyle,
        ...otherRowProps,
      },
      children,
    );
  }
}
