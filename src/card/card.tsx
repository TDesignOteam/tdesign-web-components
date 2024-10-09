import '../../src/loading';

import { Component, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix, getCommonClassName } from '../_util/classname';
import { StyledProps } from '../common';
import { TdCardProps } from './type';

export interface CardProps extends TdCardProps, StyledProps {}

@tag('t-card')
export default class Card extends Component<CardProps> {
  static css = [];

  static defaultProps = {
    bordered: true,
    headerBordered: false,
    hoverShadow: false,
    loading: false,
    shadow: false,
    size: 'medium',
    theme: 'normal',
    ignoreAttributes: [],
  };

  static propTypes = {
    actions: [String, Number, Object, Function],
    avatar: [String, Number, Object, Function],
    bordered: Boolean,
    children: [String, Number, Object, Function],
    content: [String, Number, Object, Function],
    cover: [String, Number, Object, Function],
    description: [String, Number, Object, Function],
    footer: [String, Number, Object, Function],
    header: [String, Number, Object, Function],
    headerBordered: Boolean,
    hoverShadow: Boolean,
    loading: [String, Number, Object, Function],
    loadingProps: Object,
    shadow: Boolean,
    size: String,
    status: String,
    subtitle: [String, Number, Object, Function],
    theme: String,
    title: [String, Number, Object, Function],
    ignoreAttributes: Object,
  };

  cardRef = createRef();

  render(props: OmiProps<CardProps>) {
    const {
      actions,
      avatar,
      bordered,
      children,
      cover,
      description,
      footer,
      header,
      headerBordered,
      hoverShadow,
      loading,
      shadow,
      size,
      subtitle,
      title,
      theme,
      status,
      loadingProps,
      ignoreAttributes,
      innerClass,
      innerStyle,
    } = props;

    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }

    const isPoster2 = theme === 'poster2';
    const showHeader =
      header || title || subtitle || description || avatar || (actions && !isPoster2) || (status && isPoster2);

    const classPrefix = getClassPrefix();

    const renderTitle = title ? <div className={`${classPrefix}-card__title`}>{title}</div> : null;

    const renderSubtitle = subtitle ? <div className={`${classPrefix}-card__subtitle`}>{subtitle}</div> : null;

    const renderDescription = description ? <p className={`${classPrefix}-card__description`}>{description}</p> : null;

    const renderAvatar = avatar && <div className={`${classPrefix}-card__avatar`}>{avatar}</div>;

    const renderHeaderActions = actions && !isPoster2 && (
      <div className={`${classPrefix}-card__actions`}>{actions}</div>
    );

    const renderFooterActions = actions && isPoster2 && <div className={`${classPrefix}-card__actions`}>{actions}</div>;

    const renderStatus = status && isPoster2 && (
      <div
        className={classname({
          [`${classPrefix}-card__actions`]: actions,
        })}
      >
        {status}
      </div>
    );

    const renderHeader = header ? (
      <div
        className={classname({
          [`${classPrefix}-card__header`]: showHeader,
          [`${classPrefix}-card__title--bordered`]: headerBordered,
        })}
      >
        {header}
      </div>
    ) : (
      <div
        className={classname({
          [`${classPrefix}-card__header`]: showHeader,
          [`${classPrefix}-card__title--bordered`]: headerBordered,
        })}
      >
        <div className={`${classPrefix}-card__header-wrapper`}>
          {renderAvatar}
          <div>
            {renderTitle}
            {renderSubtitle}
            {renderDescription}
          </div>
        </div>
        {renderHeaderActions}
        {renderStatus}
      </div>
    );

    const renderCover = cover ? (
      <div className={`${classPrefix}-card__cover`}>
        {typeof cover === 'string' ? <img src={cover} alt=""></img> : cover}
      </div>
    ) : null;

    const renderChildren = children && <div className={`${classPrefix}-card__body`}>{children}</div>;

    const renderFooter = footer && (
      <div className={`${classPrefix}-card__footer`}>
        <div className={`${classPrefix}-card__footer-wrapper`}>{footer}</div>
        {renderFooterActions}
      </div>
    );

    const commonClassNames = getCommonClassName();

    const card = (
      <div
        ref={this.cardRef}
        className={classname(
          `${classPrefix}-card`,
          {
            [commonClassNames.SIZE.small]: size === 'small',
            [`${classPrefix}-card--bordered`]: bordered,
            [`${classPrefix}-card--shadow`]: shadow,
            [`${classPrefix}-card--shadow-hover`]: hoverShadow,
          },
          innerClass,
        )}
        style={innerStyle}
      >
        {showHeader ? renderHeader : null}
        {renderCover}
        {renderChildren}
        {renderFooter}
      </div>
    );

    return loading ? <t-loading {...loadingProps}>{card}</t-loading> : card;
  }
}
