import '../loading/loading';

import classNames from 'classnames';
import { Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { ListProps } from './types';

const listclassPrefix = (className: string) => `${getClassPrefix()}-list${className}`;

@tag('t-list')
export default class BackTop extends Component<ListProps> {
  static css = [];

  static defaultProps = {
    layout: 'horizontal',
    size: 'medium',
    split: false,
    stripe: false,
  };

  static propTypes = {
    split: Boolean,
    stripe: Boolean,
    dragSort: Boolean,

    asyncLoading: String,
    footer: String,
    header: String,
    children: String,

    layout: String,
    size: String,

    onLoadMore: Function,
    onScroll: Function,
  };

  getClasses(split: Boolean, stripe: Boolean) {
    const cls: string[] = [];
    if (split) {
      cls.push(listclassPrefix('--split'));
    }
    if (stripe) {
      cls.push(listclassPrefix('--stripe'));
    }
    return cls;
  }

  renderLoadElement(asyncLoading: string) {
    if (typeof asyncLoading === 'string' && asyncLoading) {
      return (
        <div
          className={classNames(listclassPrefix(`__load`), {
            [listclassPrefix(`__load--loading`)]: asyncLoading === 'loading',
            [listclassPrefix(`__load--load-more`)]: asyncLoading === 'load-more',
          })}
          onClick={(e) => {
            this.handleClickLoad(e, asyncLoading);
          }}
        >
          {asyncLoading === 'loading' && (
            <div>
              <t-loading />
              <span>正在加载中，请稍后</span>
            </div>
          )}
          {asyncLoading === 'load-more' && <span>点击加载更多</span>}
        </div>
      );
    }
  }

  handleClickLoad = (e: Event, asyncLoading: string) => {
    if (asyncLoading === 'load-more') {
      console.log(e);
      this.fire('loadMore', { event: e });
    }
  };

  renderHeader(header: any) {
    return <div class={classNames(listclassPrefix('header'))}>{header}</div>;
  }

  renderFooter(footer: any) {
    return <div class={classNames(listclassPrefix('footer'))}>{footer}</div>;
  }

  render(props: OmiProps<ListProps>) {
    const { header, footer, split, size, innerClass, innerStyle, layout, stripe, children, asyncLoading } = props;
    return (
      <div
        class={classNames(
          `${listclassPrefix('')}`,
          {
            [listclassPrefix('--split')]: split,
            [listclassPrefix('--stripe')]: stripe,
            [listclassPrefix('--vertical-action')]: layout === 'vertical',
            [`${getClassPrefix()}-size-s`]: size === 'small',
            [`${getClassPrefix()}-size-l`]: size === 'large',
          },
          innerClass,
        )}
        style={innerStyle}
      >
        {header && this.renderHeader(header)}
        <ul class={classNames(listclassPrefix('__inner'))}>{children}</ul>
        {asyncLoading && this.renderLoadElement(asyncLoading as string)}
        {footer && this.renderFooter(footer)}
      </div>
    );
  }
}
