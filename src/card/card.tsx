import '../../src/loading';

import { Component, createRef, OmiProps,tag } from 'omi';

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
    action: Object,
    avatar: Object,
    bordered: Boolean,
    content: Object,
    cover: [Object, String],
    description: Object,
    footer: Object,
    header: Object,
    headerBordered: Boolean,
    hoverShadow: Boolean,
    loading: [Boolean, Object],
    shadow: Boolean,
    size: String,
    status: String,
    subtitle: Object,
    theme: String,
    title: Object,
  };

  cardRef = createRef();

  render(props: OmiProps<CardProps>) {
    const {
      actions,
      avatar,
      bordered,
      children,
      className, // 新增
      cover,
      description,
      footer,
      header,
      headerBordered,
      hoverShadow,
      loading,
      shadow,
      size,
      style, // 新增
      subtitle,
      title,
      theme,
      status,
      loadingProps, // 新增
      ignoreAttributes, // 新增
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

    const titleClass = classname({
      [`${classPrefix}-card__title`]: title,
    });
    const renderTitle = title ? <div className={titleClass}>{title}</div> : null;

    const subtitleClass = classname({
      [`${classPrefix}-card__subtitle`]: subtitle,
    });
    const renderSubtitle = subtitle ? <div className={subtitleClass}>{subtitle}</div> : null;

    const descriptionClass = classname({
      [`${classPrefix}-card__description`]: description,
    });
    const renderDescription = description ? <p className={descriptionClass}>{description}</p> : null;

    const avatarClass = classname({
      [`${classPrefix}-card__avatar`]: avatar,
    });
    const renderAvatar = avatar && <div className={avatarClass}>{avatar}</div>;

    const actionClass = classname({
      [`${classPrefix}-card__actions`]: actions,
    });
    const renderHeaderActions = actions && !isPoster2 && <div className={actionClass}>{actions}</div>;
    const renderFooterActions = actions && isPoster2 && <div className={actionClass}>{actions}</div>;
    const renderStatus = status && isPoster2 && <div className={actionClass}>{status}</div>;

    const headerClass = classname({
      [`${classPrefix}-card__header`]: showHeader,
      [`${classPrefix}-card__title--bordered`]: headerBordered,
    });
    const renderHeader = () => {
      if (header) {
        return <div className={headerClass}>{header}</div>;
      }
      return (
        <div className={headerClass}>
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
    };

    const coverClass = classname({
      [`${classPrefix}-card__cover`]: cover,
    });
    const renderCover = cover ? (
      <div className={coverClass}>{typeof cover === 'string' ? <img src={cover} alt=""></img> : cover}</div>
    ) : null;

    const bodyClass = classname({
      [`${classPrefix}-card__body`]: children,
    });
    const renderChildren = children && <div className={bodyClass}>{children}</div>;

    const footerClass = classname({
      [`${classPrefix}-card__footer`]: footer,
    });
    const renderFooter = footer && (
      <div className={footerClass}>
        <div className={`${classPrefix}-card__footer-wrapper`}>{footer}</div>
        {renderFooterActions}
      </div>
    );

    const commonClassNames = getCommonClassName();
    const cardClass = classname(`${classPrefix}-card`, className, {
      [commonClassNames.SIZE.small]: size === 'small',
      [`${classPrefix}-card--bordered`]: bordered,
      [`${classPrefix}-card--shadow`]: shadow,
      [`${classPrefix}-card--shadow-hover`]: hoverShadow,
    });
    const card = (
      <div ref={this.cardRef} className={cardClass} style={style}>
        {showHeader ? renderHeader() : null}
        {renderCover}
        {renderChildren}
        {renderFooter}
      </div>
    );

    return loading ? (
      <t-loading {...loadingProps} style={style}>
        {card}
      </t-loading>
    ) : (
      card
    );
  }
}
