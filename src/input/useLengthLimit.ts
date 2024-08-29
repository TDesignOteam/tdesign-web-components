import log from '../_common/js/log';
import { getCharacterLength, getUnicodeLength, limitUnicodeMaxLength } from '../_common/js/utils/helper';
import { TdInputProps } from './type';

export interface UseLengthLimitParams {
  value: string;
  maxlength: number;
  maxcharacter: number;
  allowInputOverMax: boolean;
  status: TdInputProps['status'];
  onValidate: TdInputProps['onValidate'];
}

export default function useLengthLimit(params: UseLengthLimitParams) {
  // 文本超出数量限制时，是否允许继续输入
  const getValueByLimitNumber = (inputValue: string) => {
    const { allowInputOverMax, maxlength, maxcharacter } = params;
    if (!(maxlength || maxcharacter) || allowInputOverMax || !inputValue) return inputValue;
    if (maxlength) {
      return limitUnicodeMaxLength(inputValue, maxlength);
    }
    if (maxcharacter) {
      const r = getCharacterLength(inputValue, maxcharacter);
      console.log(r);
      if (typeof r === 'object') {
        return r.characters;
      }
    }
  };

  const limitNumber = () => {
    const { maxlength, maxcharacter, value } = params;
    if (typeof value === 'number') return String(value);
    if (maxlength && maxcharacter) {
      log.warn('Input', 'Pick one of maxlength and maxcharacter please.');
    }
    if (maxlength) {
      const length = value?.length ? getUnicodeLength(value) : 0;
      return `${length}/${maxlength}`;
    }
    if (maxcharacter) {
      return `${getCharacterLength(value || '')}/${maxcharacter}`;
    }
    return '';
  };
  const innerStatus = () => {
    if (limitNumber()) {
      const [current, total] = limitNumber().split('/');
      return Number(current) > Number(total) ? 'error' : '';
    }
    return '';
  };

  const tStatus = params.status || innerStatus();

  const onValidateChange = () => {
    params.onValidate?.({
      error: innerStatus() ? 'exceed-maximum' : undefined,
    });
  };

  return {
    tStatus,
    limitNumber,
    getValueByLimitNumber,
    onValidateChange,
  };
}
