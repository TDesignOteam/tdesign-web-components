import { StyledProps } from '../common';

export type ChatLoadingAnimationType = 'skeleton' | 'moving' | 'gradient' | 'circle' | 'dot';

interface ChatLoadingProps {
  text?: string;
  animation?: ChatLoadingAnimationType;
}

export interface TdChatLoadingProps extends ChatLoadingProps, StyledProps {}
