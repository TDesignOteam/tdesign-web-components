import { StyledProps } from '@tdesign/web-components-shared/common';

export type ChatLoadingAnimationType = 'skeleton' | 'moving' | 'gradient' | 'circle' | 'dots';

interface ChatLoadingProps {
  /**
   * 加载提示文本
   * @default ''
   */
  text?: string;
  /**
   * 加载动画
   * @default moving
   */
  animation?: ChatLoadingAnimationType;
}

export interface TdChatLoadingProps extends ChatLoadingProps, StyledProps {}
