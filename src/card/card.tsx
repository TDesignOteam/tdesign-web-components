import '../../src/loading';

import { Component, createRef, tag } from 'omi';

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

  ref = createRef();

  render(props: CardProps) {
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

    const classPrefix = getClassPrefix();
    const commonClassNames = getCommonClassName();
    // 是否为海报风格2
    const isPoster2 = theme === 'poster2';

    const cardClass = classname(`${classPrefix}-card`, className, {
      [commonClassNames.SIZE.small]: size === 'small',
      [`${classPrefix}-card--bordered`]: bordered,
      [`${classPrefix}-card--shadow`]: shadow,
      [`${classPrefix}-card--shadow-hover`]: hoverShadow,
    });

    const showHeader =
      header || title || subtitle || description || avatar || (actions && !isPoster2) || (status && isPoster2);

    const headerClass = classname({
      [`${classPrefix}-card__header`]: showHeader,
      [`${classPrefix}-card__title--bordered`]: headerBordered,
    });

    const titleClass = classname({
      [`${classPrefix}-card__title`]: title,
    });

    const subtitleClass = classname({
      [`${classPrefix}-card__subtitle`]: subtitle,
    });

    const actionClass = classname({
      [`${classPrefix}-card__actions`]: actions,
    });

    const footerClass = classname({
      [`${classPrefix}-card__footer`]: footer,
    });

    const coverClass = classname({
      [`${classPrefix}-card__cover`]: cover,
    });

    const avatarClass = classname({
      [`${classPrefix}-card__avatar`]: avatar,
    });

    const bodyClass = classname({
      [`${classPrefix}-card__body`]: children,
    });

    const descriptionClass = classname({
      [`${classPrefix}-card__description`]: description,
    });

    const renderTitle = title ? <div className={titleClass}>{title}</div> : null;

    const renderSubtitle = subtitle ? <div className={subtitleClass}>{subtitle}</div> : null;

    const renderDescription = description ? <p className={descriptionClass}>{description}</p> : null;

    const renderAvatar = avatar && <div className={avatarClass}>{avatar}</div>;

    const renderHeaderActions = actions && !isPoster2 && <div className={actionClass}>{actions}</div>;
    const renderFooterActions = actions && isPoster2 && <div className={actionClass}>{actions}</div>;

    const renderStatus = status && isPoster2 && <div className={actionClass}>{status}</div>;

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

    const renderCover = cover ? (
      <div className={coverClass}>{typeof cover === 'string' ? <img src={cover} alt=""></img> : cover}</div>
    ) : null;

    const renderChildren = children && <div className={bodyClass}>{children}</div>;

    const renderFooter = footer && (
      <div className={footerClass}>
        <div className={`${classPrefix}-card__footer-wrapper`}>{footer}</div>
        {renderFooterActions}
      </div>
    );

    const card = (
      <div ref={this.ref} className={cardClass} style={style}>
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
