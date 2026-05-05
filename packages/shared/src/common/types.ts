import type { CSSSelector, PlainObject, Styles } from '@common/js/common';
import { Component, VNode, WeElement } from 'omi';

// Re-export from @common to avoid duplication with submodule
export type {
  PlainObject,
  OptionData,
  SizeEnum,
  HorizontalAlignEnum,
  VerticalAlignEnum,
  ClassName,
  CSSSelector,
  Styles,
} from '@common/js/common';

export {
  EKeyboardDirection,
  ARROW_DOWN_REG,
  ARROW_UP_REG,
  ARROW_LEFT_REG,
  ARROW_RIGHT_REG,
  ESCAPE_REG,
  SPACE_REG,
  ENTER_REG,
  SHIFT_REG,
  CLEAR_REG,
  ALL_REG,
  CHECKED_CODE_REG,
  THEME_MODE,
} from '@common/js/common';

// ---- Omi-specific types (no equivalent in _common) ----

export type TElement<T = undefined> = T extends undefined ? WeElement : (props: T) => WeElement;
export type TNode<T = any> = VNode<T> | ((props: T) => VNode) | object | string | number | boolean | null;

export type AttachNodeReturnValue = HTMLElement | Element | Document;
export type AttachNode = CSSSelector | ((triggerNode?: HTMLElement) => AttachNodeReturnValue);

export type ScrollContainerElement = Window | HTMLElement;
export type ScrollContainer = (() => ScrollContainerElement) | CSSSelector;

export type ComponentType = any;

export interface StyledProps {
  className?: string;
  style?: Styles;
  innerClass?: string;
  innerStyle?: Styles;
}

// TreeOptionData overrides label to support TNode
export type TreeOptionData<T = string | number> = {
  children?: Array<TreeOptionData<T>> | boolean;
  label?: string | TNode;
  text?: string;
  value?: T;
  content?: string | TNode;
} & PlainObject;

export enum LayoutEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export interface KeysType {
  value?: string;
  label?: string;
  disabled?: string;
}

export interface TreeKeysType extends KeysType {
  children?: string;
}

export interface HTMLElementAttributes {
  [attribute: string]: string;
}

export interface TScroll {
  bufferSize?: number;
  isFixedRowHeight?: boolean;
  rowHeight?: number;
  threshold?: number;
  type: 'lazy' | 'virtual';
}

/** @deprecated use TScroll instead */
export type InfinityScroll = TScroll;

export interface ScrollToElementParams {
  index?: number;
  top?: number;
  time?: number;
  behavior?: 'auto' | 'smooth';
}

export interface ComponentScrollToElementParams extends ScrollToElementParams {
  key?: string | number;
}

export type ExtendedElement = (HTMLElement | SVGAElement | HTMLInputElement) & {
  receiveProps: Function;
  update: Function;
  queuedUpdate: Function;
  store?: unknown;
  className?: string;
  props: Record<string, unknown>;
  splitText?: Function;
  prevProps?: Record<string, unknown> & {
    ref?: { current?: unknown } | Function;
  };
  attributes: NamedNodeMap;
  _component?: Component;
  _listeners: Record<string, Function>;
} & Record<string, unknown>;
