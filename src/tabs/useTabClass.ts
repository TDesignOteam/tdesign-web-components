import { getClassPrefix } from '../_util/classname';

export const useTabClass = () => {
  const tdTabsClassPrefix = `${getClassPrefix()}-tabs`;
  const tdTabPanelClassPrefix = `${getClassPrefix()}-tab-panel`;
  const tdClassGenerator = (append: string) => `${getClassPrefix()}-${append}`;
  const tdTabsClassGenerator = (append: string) => `${tdTabsClassPrefix}__${append}`;
  const tdTabPanelClassGenerator = (append: string) => `${tdTabPanelClassPrefix}__${append}`;
  const tdSizeClassGenerator = (size: 'medium' | 'large') => `${getClassPrefix()}-size-${size === 'large' ? 'l' : 'm'}`;

  return {
    tdTabsClassPrefix,
    tdTabPanelClassPrefix,
    tdClassGenerator,
    tdTabsClassGenerator,
    tdTabPanelClassGenerator,
    tdSizeClassGenerator,
  };
};
