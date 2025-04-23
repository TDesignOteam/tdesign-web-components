import { StyledProps } from '../common';

interface ChatLoadingProps {
  text?: string;
  animation?: 'skeleton' | 'moving' | 'gradient' | 'circle';
}

export interface TdChatLoadingProps extends ChatLoadingProps, StyledProps {}
