import type { CollapseValue } from '@tdesign/web-components/collapse';

export type TdChatCollapsibleContentProps = {
  defaultCollapsed?: boolean;
  onCollapsedChange?: (e: CustomEvent<boolean>) => void;
};

export type ChatContentRenderProps<T> = T & {
  key?: string;
  onChange?: (e: CustomEvent<CollapseValue>) => void;
};
