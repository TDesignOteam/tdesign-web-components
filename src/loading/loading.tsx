import './gradient';
import '../common/portal';

import { Component, tag } from 'omi';

import classnames, { getClassPrefix } from '../_util/classname';
import { addClass, canUseDocument, removeClass } from '../_util/dom';
import { StyledProps, Styles } from '../common';
import { TdLoadingProps } from './type';

export interface LoadingProps extends TdLoadingProps, StyledProps {}

const loadingDefaultProps: TdLoadingProps = {
  delay: 0,
  fullscreen: false,
  indicator: true,
  inheritColor: false,
  loading: true,
  preventScrollThrough: true,
  showOverlay: true,
  size: 'medium',
};

@tag('t-loading')
export default class Loading extends Component<LoadingProps> {
  static defaultProps = loadingDefaultProps;

  showLoading = false;

  showLoadingFlag = false;

  lockClass = `${getClassPrefix()}-loading--lock`;

  timer: NodeJS.Timeout;

  get calcStyles() {
    const { size, zIndex } = this.props;
    const styles: Styles = {};

    if (zIndex !== undefined) {
      styles.zIndex = zIndex;
    }

    if (!['small', 'medium', 'large'].includes(size)) {
      styles.fontSize = size;
    }

    return styles;
  }

  openLoading() {
    const { delay, loading } = this.props;
    if (delay && loading) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showLoading = true;
        this.showLoadingFlag = true;
        this.update();
      }, delay);
    } else {
      this.showLoading = true;
      this.showLoadingFlag = true;
      this.update();
    }
  }

  install(): void {
    this.openLoading();
  }

  beforeUpdate(): void {
    const { preventScrollThrough, fullscreen, loading, delay } = this.props;
    if (loading === true && this.showLoadingFlag === false) {
      this.openLoading();
    }
    if (this.showLoadingFlag === false || loading === false) {
      this.showLoading = delay ? false : loading;
    } else {
      this.showLoadingFlag = false;
    }

    if (preventScrollThrough && fullscreen && canUseDocument) {
      if (loading) {
        addClass(document.body, this.lockClass);
      } else {
        removeClass(document.body, this.lockClass);
      }
    }
  }

  uninstall(): void {
    clearTimeout(this.timer);
    removeClass(document.body, this.lockClass);
  }

  render(props) {
    const {
      indicator,
      text,
      loading,
      size,
      fullscreen,
      showOverlay,
      content,
      children,
      inheritColor,
      className,
      style,
      attach,
    } = props;

    const classPrefix = getClassPrefix();
    const name = `${classPrefix}-loading`;
    const centerClass = `${classPrefix}-loading--center`;
    const inheritColorClass = `${classPrefix}-loading--inherit-color`;
    const fullClass = `${classPrefix}-loading--full`;
    const fullscreenClass = `${classPrefix}-loading__fullscreen`;
    const overlayClass = `${classPrefix}-loading__overlay`;
    const relativeClass = `${classPrefix}-loading__parent`;
    const textClass = `${classPrefix}-loading__text`;

    const sizeMap = {
      large: `${classPrefix}-size-l`,
      small: `${classPrefix}-size-s`,
      medium: `${classPrefix}-size-m`,
    };

    const baseClasses = classnames(
      centerClass,
      sizeMap[size],
      {
        [inheritColorClass]: inheritColor,
      },
      className,
    );

    const commonContent = () => {
      let renderIndicator = <t-loading-gradient />;

      if (indicator && typeof indicator !== 'boolean') {
        renderIndicator = indicator as JSX.Element;
      }
      return (
        <>
          {indicator ? renderIndicator : null}
          {text ? <div className={textClass}>{text}</div> : null}
        </>
      );
    };

    if (fullscreen) {
      return loading ? (
        <div
          className={classnames(name, fullscreenClass, centerClass, overlayClass)}
          style={{ ...this.calcStyles, ...style }}
        >
          <div className={baseClasses}>{commonContent()}</div>
        </div>
      ) : null;
    }

    if (content || children) {
      return (
        <div className={relativeClass} style={style}>
          {content || children}
          {this.showLoading ? (
            <div
              className={classnames(name, baseClasses, fullClass, {
                [overlayClass]: showOverlay,
              })}
              style={this.calcStyles}
            >
              {commonContent()}
            </div>
          ) : null}
        </div>
      );
    }

    if (attach) {
      return (
        <t-portal attach={attach}>
          {loading ? (
            <div
              className={classnames(name, baseClasses, fullClass, { [overlayClass]: showOverlay })}
              style={{ ...this.calcStyles, ...style }}
            >
              {commonContent()}
            </div>
          ) : null}
        </t-portal>
      );
    }

    return loading ? (
      <div className={classnames(name, baseClasses)} style={{ ...this.calcStyles, ...style }}>
        {commonContent()}
      </div>
    ) : null;
  }
}
