import { StyledProps } from '@tdesign/web-components-shared/common';

export type ChatLoadingAnimationType = 'skeleton' | 'moving' | 'gradient' | 'circle' | 'dots';

interface ChatLoadingProps {
  text?: string;
  animation?: ChatLoadingAnimationType;
}

export interface TdChatLoadingProps extends ChatLoadingProps, StyledProps {}
