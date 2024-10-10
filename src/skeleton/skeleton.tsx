import isNumber from 'lodash/isNumber';
import { classNames, Component, createRef, tag } from 'omi';

import { pxCompat } from '../_common/js/utils/helper';
import { getClassPrefix } from '../_util/classname';
import parseTNode from '../_util/parseTNode';
import { StyledProps, Styles, TNode } from '../common';
import { SkeletonRowCol, SkeletonRowColObj, TdSkeletonProps } from './type';

export type SkeletonProps = TdSkeletonProps & StyledProps & { children: TNode };
type SkeletonInjection = (props: SkeletonProps) => SkeletonProps;

const ThemeMap: Record<SkeletonProps['theme'], SkeletonRowCol> = {
  text: [1],
  avatar: [{ type: 'circle', size: '56px' }],
  paragraph: [1, 1, { width: '70%' }],
  'avatar-text': [[{ type: 'circle' }, { type: 'text', height: '32px' }]],
  tab: [{ height: '30px' }, { height: '200px' }],
  article: [
    { type: 'rect', height: '30px', width: '100%' },
    { type: 'rect', height: '200px', width: '100%' },
    ...[3, 2, 2, 2].map((value) => Array(value).fill({ type: 'text', height: '30px' })),
  ],
};

const compname = `${getClassPrefix()}-skeleton`;

@tag('t-skeleton')
export default class Skeleton extends Component<SkeletonProps> {
  static css = [];

  static defaultProps = { animation: 'none', delay: 0, loading: true, theme: 'text' };

  static propsType = {
    animation: String,
    delay: Number,
    loading: Boolean,
    rowCol: Object,
    theme: String,
  };

  timerRef = createRef();

  inject = [compname];

  injectProps: SkeletonProps;

  get afterProps() {
    return this.injectProps ? this.injectProps : this.props;
  }

  private ctrlLoading;

  private setCtrlLoading = (loading: boolean) => {
    this.ctrlLoading = loading;
    this.injectProps = (this.injection[compname] as SkeletonInjection | undefined)?.(this.props);
    this.update();
  };

  get internalLoading() {
    return this.ctrlLoading || this.afterProps.loading;
  }

  receiveProps(props: SkeletonProps, old: SkeletonProps) {
    if (props.loading !== old.loading && props?.delay > 0) {
      clearTimeout(this.timerRef.current as number);
      this.timerRef.current = window.setTimeout(() => {
        this.setCtrlLoading(props.loading);
      }, props.delay);
      this.setCtrlLoading(true);
    }
    return true;
  }

  uninstall(): void {
    if (this.timerRef.current) {
      clearTimeout(this.timerRef.current as number);
    }
  }

  render() {
    const { animation, rowCol, theme, innerClass, innerStyle, children } = this.afterProps;
    const renderCols = (_cols: Number | SkeletonRowColObj | Array<SkeletonRowColObj>) => {
      const getColItemClass = (obj: SkeletonRowColObj) =>
        classNames(`${compname}__col`, `${compname}--type-${obj.type || 'text'}`, {
          [`${compname}--animation-${animation}`]: animation,
        });

      const getColItemStyle = (obj: SkeletonRowColObj): Styles => {
        const styleName = [
          'width',
          'height',
          'marginRight',
          'marginLeft',
          'margin',
          'size',
          'background',
          'backgroundColor',
        ];
        const style: Styles = {};
        styleName.forEach((name) => {
          if (name in obj) {
            const px = pxCompat(obj[name as keyof typeof pxCompat]);
            if (name === 'size') {
              [style.width, style.height] = [px, px];
            } else {
              style[name] = px;
            }
          }
        });
        return style;
      };

      let cols: Array<SkeletonRowColObj> = [];
      if (Array.isArray(_cols)) {
        cols = _cols;
      } else if (isNumber(_cols)) {
        cols = new Array(_cols).fill({ type: 'text' }) as SkeletonRowColObj[];
      } else {
        cols = [_cols as SkeletonRowColObj];
      }

      return cols.map((item, index) => (
        <div key={index} class={getColItemClass(item)} style={getColItemStyle(item)}>
          {parseTNode(item.content as TNode)}
        </div>
      ));
    };

    const renderRowCol = (_rowCol?: SkeletonRowCol) => {
      const renderedRowCol: SkeletonRowCol = _rowCol || rowCol;

      return renderedRowCol.map((item, index) => (
        <div key={index} class={`${compname}__row`}>
          {renderCols(item)}
        </div>
      ));
    };

    if (!this.internalLoading) {
      // 展示实际内容
      return <>{children?.[0]}</>;
    }

    // 展示骨架屏
    const childrenContent = [];
    if (theme && !rowCol) {
      childrenContent.push(renderRowCol(ThemeMap[theme]));
    }
    if (rowCol) {
      childrenContent.push(renderRowCol(rowCol));
    }
    if (!theme && !rowCol) {
      // 什么都不传时，传入默认 rowCol
      childrenContent.push(renderRowCol([1, 1, 1, { width: '70%' }]));
    }

    return (
      <div class={classNames(innerClass)} style={innerStyle}>
        {childrenContent[0]}
      </div>
    );
  }
}
