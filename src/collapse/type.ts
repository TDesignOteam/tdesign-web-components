/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TNode } from '../common';

export interface TdCollapseProps {
  /**
   * 类名
   */
  className?: string;
  /**
   * 是否为无边框模式
   * @default false
   */
  borderless?: boolean;
  /**
   * 默认是否展开全部
   * @default false
   */
  defaultExpandAll?: boolean;
  /**
   * 是否禁用面板展开/收起操作
   */
  disabled?: boolean;
  /**
   * 展开图标的位置，左侧或右侧
   * @default left
   */
  expandIconPlacement?: 'left' | 'right';
  /**
   * 每个面板互斥展开，每次只展开一个面板
   * @default false
   */
  expandMutex?: boolean;
  /**
   * 是否允许点击整行标题展开面板
   * @default true
   */
  expandOnRowClick?: boolean;
  /**
   * 展开的面板集合
   */
  value?: CollapseValue;
  /**
   * 展开的面板集合，非受控属性
   */
  defaultValue?: CollapseValue;
  /**
   * 切换面板时触发，返回变化的值
   */
  onChange?: (e: CustomEvent<CollapseValue>) => void;
  /**
   * 内容
   */
  children?: TNode;
}

export interface TdCollapsePanelProps {
  /**
   * 类名
   */
  className?: string;
  /**
   * 当前面板处理折叠状态时，是否销毁面板内容
   * @default false
   */
  destroyOnCollapse?: boolean;
  /**
   * 禁止当前面板展开，优先级大于 Collapse 的同名属性
   */
  disabled?: boolean;
  /**
   * 当前面板唯一标识，如果值为空则取当前面下标兜底作为唯一标识
   */
  value?: string | number;
  /**
   * 当前折叠面板展开图标
   */
  expandIcon?: boolean | TNode;
  /**
   * 面板头内容
   */
  header?: string | TNode;
  /**
   * 折叠面板内容
   */
  content?: string | TNode;
  /**
   * 面板头的右侧区域，一般用于呈现面板操作
   */
  headerRightContent?: string | TNode;
}

export type CollapseValue = Array<string | number>;

export type CollapsePanelValue = string | number;
