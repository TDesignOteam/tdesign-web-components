import 'tdesign-icons-web-components/esm/components/chevron-down';
import 'tdesign-icons-web-components/esm/components/chevron-left';
import 'tdesign-icons-web-components/esm/components/chevron-right';
import 'tdesign-icons-web-components/esm/components/chevron-up';
import 'tdesign-icons-web-components/esm/components/round';
import '../button';

import classNames from 'classnames';

import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { paginationMiniDefaultProps } from './defaultProps';
import { JumperDisabledConfig, JumperTipsConfig, TdPaginationMiniProps } from './type';

const PAGINATION_ICON_SIZE_MAP = {
  small: '14px',
  medium: '16px',
  large: '18px',
} as const;

const DEFAULT_TIPS: Required<JumperTipsConfig> = {
  prev: '上一页',
  current: '当前',
  next: '下一页',
};

export interface PaginationMiniProps extends TdPaginationMiniProps, StyledProps {
  class?: string;
}

function normalizeDisabled(disabled?: boolean | JumperDisabledConfig): Required<JumperDisabledConfig> {
  if (typeof disabled === 'boolean') {
    return {
      prev: disabled,
      current: disabled,
      next: disabled,
    };
  }
  return {
    prev: disabled?.prev ?? false,
    current: disabled?.current ?? false,
    next: disabled?.next ?? false,
  };
}

function normalizeTips(tips?: boolean | JumperTipsConfig): JumperTipsConfig {
  if (tips === true) return { ...DEFAULT_TIPS };
  if (!tips) return {};
  return tips;
}

export const PaginationMini = (props: PaginationMiniProps) => {
  const classPrefix = getClassPrefix();
  const {
    layout = paginationMiniDefaultProps.layout,
    showCurrent = paginationMiniDefaultProps.showCurrent,
    size = paginationMiniDefaultProps.size,
    variant = paginationMiniDefaultProps.variant,
    disabled,
    tips,
    onChange,
    class: className,
    style,
    innerClass,
  } = props;

  const disabledConfig = normalizeDisabled(disabled);
  const tipConfig = normalizeTips(tips);

  const rootClassName = classNames(`${classPrefix}-pagination-mini`, className, innerClass, {
    [`${classPrefix}-pagination-mini--outline`]: variant === 'outline',
  });

  const handleClick = (trigger: 'prev' | 'current' | 'next') => (e: MouseEvent) => {
    const isDisabled = disabledConfig[trigger];
    if (isDisabled) return;
    onChange?.({ e, trigger });
  };

  const horizontal = layout !== 'vertical';

  const iconSize = PAGINATION_ICON_SIZE_MAP[size ?? 'small'] || PAGINATION_ICON_SIZE_MAP.small;
  const iconStyle = {
    fontSize: iconSize,
    width: iconSize,
    height: iconSize,
  } as const;

  return (
    <div className={rootClassName} style={style}>
      <t-button
        title={tipConfig.prev}
        variant={variant}
        size={size}
        shape="square"
        disabled={disabledConfig.prev}
        innerClass={`${classPrefix}-pagination-mini__prev`}
        icon={horizontal ? <t-icon-chevron-left style={iconStyle} /> : <t-icon-chevron-up style={iconStyle} />}
        onClick={handleClick('prev')}
      />

      {showCurrent && (
        <t-button
          title={tipConfig.current}
          variant={variant}
          size={size}
          shape="square"
          disabled={disabledConfig.current}
          innerClass={`${classPrefix}-pagination-mini__current`}
          icon={<t-icon-round style={iconStyle} />}
          onClick={handleClick('current')}
        />
      )}

      <t-button
        title={tipConfig.next}
        variant={variant}
        size={size}
        shape="square"
        disabled={disabledConfig.next}
        innerClass={`${classPrefix}-pagination-mini__next`}
        icon={horizontal ? <t-icon-chevron-right style={iconStyle} /> : <t-icon-chevron-down style={iconStyle} />}
        onClick={handleClick('next')}
      />
    </div>
  );
};

export default PaginationMini;
