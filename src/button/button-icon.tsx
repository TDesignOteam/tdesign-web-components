import { define } from 'omi';

import { Icon } from '../icon';

export default class ButtonIcon extends Icon {
  static isLightDOM = true;
}

define('t-button-icon', ButtonIcon);
