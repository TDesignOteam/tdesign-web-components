import { SizeEnum } from '../common';

export type JumperTrigger = 'prev' | 'current' | 'next';

export interface JumperDisabledConfig {
  prev?: boolean;
  current?: boolean;
  next?: boolean;
}

export interface JumperTipsConfig {
  prev?: string;
  current?: string;
  next?: string;
}

export interface TdPaginationMiniProps {
  disabled?: boolean | JumperDisabledConfig;
  layout?: 'horizontal' | 'vertical';
  showCurrent?: boolean;
  size?: SizeEnum;
  tips?: boolean | JumperTipsConfig;
  variant?: 'text' | 'outline';
  onChange?: (context: { e: MouseEvent; trigger: JumperTrigger }) => void;
}
