export type TdChatActionsName = 'copy' | 'good' | 'goodActived' | 'bad' | 'badActived' | 'replay' | 'share';
export interface TdActionProps {
  actionBar?: TdChatActionsName[] | boolean;
  onActions?: Partial<Record<TdChatActionsName, (event: MouseEvent) => void>>;
}
