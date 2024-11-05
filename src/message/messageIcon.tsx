import 'tdesign-icons-web-components/esm/components/check-circle-filled';
import 'tdesign-icons-web-components/esm/components/info-circle-filled';
import 'tdesign-icons-web-components/esm/components/error-circle-filled';
import 'tdesign-icons-web-components/esm/components/help-circle-filled';
import '../loading';

import { classPrefix } from './const';
import { TdMessageProps } from './type';

export default function MessageIcon({ theme, onCloseBtnClick }: TdMessageProps) {
  // theme 和 icon 的映射表
  const iconMap = {
    success: <t-icon-check-circle-filled className={`${classPrefix}-icon`} onClick={(e) => onCloseBtnClick?.({ e })} />,
    warning: <t-icon-check-circle-filled className={`${classPrefix}-icon`} onClick={(e) => onCloseBtnClick?.({ e })} />,
    info: <t-icon-info-circle-filled className={`${classPrefix}-icon`} onClick={(e) => onCloseBtnClick?.({ e })} />,
    error: <t-icon-error-circle-filled className={`${classPrefix}-icon`} onClick={(e) => onCloseBtnClick?.({ e })} />,
    question: <t-icon-help-circle-filled className={`${classPrefix}-icon`} onClick={(e) => onCloseBtnClick?.({ e })} />,
    loading: <t-loading className={`${classPrefix}-loading`} loading={true} size={'small'} />,
  };
  const Icon = iconMap[theme];
  return Icon ? Icon : null;
}
